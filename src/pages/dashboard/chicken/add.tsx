import {Button} from "@/components/ui/button.tsx";
import {Icon} from "@iconify/react";
import {useNavigate, useParams} from "react-router-dom";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useEffect, useState} from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {cn, isPrimaryKey, upsert} from "@/lib/utils.ts";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import pb from "@/lib/pocketbase.ts";
import useStore from "@/state";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useQuery} from "@tanstack/react-query";
import {Breed} from "@/pages/dashboard/configuration/breed/columns.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {chickenBatchStatus} from "@/lib/defaults.ts";
import {ChickenBatch} from "@/pages/dashboard/chicken/columns.tsx";

const formSchema = z.object({
    breedId: z.string().min(3),
    dateOfBirth: z.date(),
    numberOfMales: z.number().min(0),
    numberOfFemales: z.number().min(0),
    averageWeight: z.number().min(10),
    dateAcquired: z.date(),
    notes: z.string(),
    status: z.string().min(2),
}).refine(data => {
    return !(data.numberOfMales === 0 && data.numberOfFemales === 0);
}, {
    message: 'Both males and females count cannot be zero',
    path: ["numberOfMales"],
}).refine(data => {
    return !(data.numberOfMales === 0 && data.numberOfFemales === 0);
}, {
    message: 'Both males and females count cannot be zero',
    path: ["numberOfFemales"],
})

export default function ChickenAdd() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser} = useStore((state) => state);

    const {data: breedOptions} = useQuery({
        queryKey: ['breeds'],
        queryFn: () =>
            pb.collection('breeds').getFullList<Breed>({
                sort: '-created',
            }).then(r => r)
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            breedId: '',
            dateOfBirth: new Date(),
            numberOfMales: 0,
            numberOfFemales: 0,
            averageWeight: 0,
            dateAcquired: new Date(),
            notes: '',
            status: '',
        },
    })


    useEffect(() => {
        if (params.id && isPrimaryKey(params.id)) {
            setIsLoading(true);
            pb.collection('chickenBatches').getOne<ChickenBatch>(params.id).then((record) => {
                form.setValue('breedId', record.breedId);
                form.setValue('dateOfBirth', new Date(record.dateOfBirth));
                form.setValue('numberOfMales', record.numberOfMales);
                form.setValue('numberOfFemales', record.numberOfFemales);
                form.setValue('averageWeight', record.averageWeight);
                form.setValue('dateAcquired', new Date(record.dateAcquired));
                form.setValue('notes', record.notes);
                form.setValue('status', record.status);
                setIsLoading(false);
            });
        }
    }, [params.id]);


    function onSubmit(form: z.infer<typeof formSchema>) {
        setIsLoading(true);
        if (params.id) {
            upsert('chickenBatches', params.id, {
                ...form,
                userId: currentUser?.id,
                totalCount: form.numberOfMales + form.numberOfFemales
            }).then(() => {
                setIsLoading(false);
                navigate(-1);
            }).catch(() => {
                setIsLoading(false);
            });
        }
    }


    return (
        <div>
            <div>
                <div className={'flex gap-3 items-center'}>
                    <Button onClick={() => navigate(-1)} size={'icon'} variant={'outline'}>
                        <Icon icon={'lucide:arrow-left'} className={'h-5 w-5'}/>
                    </Button>
                    <h1 className={'font-bold text-xl md:text-3xl'}>Chicken Batch</h1>
                </div>
                <div>
                    <div className={'py-4 max-w-screen-sm'}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="breedId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Breed</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a breed"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {breedOptions?.map((breed) => (
                                                            <SelectItem key={breed.id} value={breed.id}>
                                                                {breed.breedName}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className={'text-xs'}/>
                                        </FormItem>
                                    )}
                                />

                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="dateOfBirth"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date of birth</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <Icon icon={'lucide:calendar'}
                                                                  className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="numberOfMales"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Number of males</FormLabel>
                                            <FormControl>
                                                <Input type={'number'}
                                                       onChange={(e) => field.onChange(e.target.value && parseInt(e.target.value))}
                                                       value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage className={'text-xs'}/>
                                        </FormItem>
                                    )}
                                />
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="numberOfFemales"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Number of females</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={'number'}
                                                    onChange={(e) => field.onChange(e.target.value && parseInt(e.target.value))}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage className={'text-xs'}/>
                                        </FormItem>
                                    )}
                                />
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="averageWeight"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Average Weight (Grams)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={'number'}
                                                    onChange={(e) => field.onChange(e.target.value && parseFloat(e.target.value))}
                                                    value={field.value}
                                                />
                                            </FormControl>
                                            <FormMessage className={'text-xs'}/>
                                        </FormItem>
                                    )}
                                />
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Status</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a batch status"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {chickenBatchStatus.map((status) => (
                                                            <SelectItem key={status.name.replaceAll(' ', '_')}
                                                                        value={status.name}>
                                                                {status.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage className={'text-xs'}/>
                                        </FormItem>
                                    )}
                                />
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="dateAcquired"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date Acquired</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(field.value, "PPP")
                                                            ) : (
                                                                <span>Pick a date</span>
                                                            )}
                                                            <Icon icon={'lucide:calendar'}
                                                                  className="ml-auto h-4 w-4 opacity-50"/>
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) =>
                                                            date > new Date() || date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className={'text-xs'}/>
                                        </FormItem>
                                    )}
                                />
                                {/**/}
                                <Button type="submit" className={'w-full'} disabled={isLoading}>
                                    {isLoading && <Icon icon={'eos-icons:loading'} className={'h-5 w-5 mr-1'}/>} Save
                                    Chicken Batch
                                </Button>
                            </form>
                        </Form>


                    </div>
                </div>
            </div>
        </div>
    )
}