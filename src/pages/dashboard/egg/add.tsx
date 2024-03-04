import {Button} from "@/components/ui/button.tsx";
import {Icon} from "@iconify/react";
import {useNavigate, useParams} from "react-router-dom";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useEffect, useState} from "react";
import {cn, isPrimaryKey, upsert} from "@/lib/utils.ts";
import pb from "@/lib/pocketbase.ts";
import useStore from "@/state";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {useQuery} from "@tanstack/react-query";
import {Textarea} from "@/components/ui/textarea.tsx";
import {EggBatch} from "@/pages/dashboard/egg/columns.tsx";
import {Breed} from "@/pages/dashboard/configuration/breed/columns.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";

const formSchema = z.object({
    breedId: z.string().min(3),
    name: z.string(),
    noOfLayers: z.number().min(0),
    startDate: z.date(),
    endDate: z.date(),
    notes: z.string().optional(),
    isActive: z.boolean(),
})

export default function EggAdd() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser} = useStore((state) => state);

    const {data: breedsOptions} = useQuery({
        queryKey: ['breeds'],
        queryFn: () =>
            pb.collection('breeds').getFullList<Breed>({
                sort: 'breedName',
            }).then(r => r)
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            breedId: '',
            name: '',
            noOfLayers: 0,
            startDate: new Date(),
            endDate: new Date(),
            notes: '',
            isActive: true,
        }
    })


    useEffect(() => {
        if (params.id && isPrimaryKey(params.id)) {
            setIsLoading(true);
            pb.collection('eggBatches').getOne<EggBatch>(params.id).then((record) => {
                form.setValue('breedId', record.breedId);
                form.setValue('name', record.name);
                form.setValue('noOfLayers', record.noOfLayers);
                form.setValue('startDate', new Date(record.startDate || new Date()));
                form.setValue('endDate', new Date(record.endDate || new Date()));
                form.setValue('notes', record.notes);
                form.setValue('isActive', record.isActive);

                setIsLoading(false);
            });
        }
    }, [params.id]);


    function onSubmit(form: z.infer<typeof formSchema>) {
        setIsLoading(true);
        if (params.id) {
            upsert('eggBatches', params.id, {
                ...form,
                userId: currentUser?.id,
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
                    <h1 className={'font-bold text-xl md:text-3xl'}>Egg Batch</h1>
                </div>
                <div>
                    <div className={'py-4 max-w-screen-sm'}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/**/}

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Egg Batch Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className={'text-xs'}/>
                                        </FormItem>
                                    )}
                                />
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="breedId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Chicken Breed</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Chicken Breed"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {breedsOptions?.map((breed) => (
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
                                    name="noOfLayers"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>No of Layers</FormLabel>
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
                                    name="startDate"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Batch Start Date</FormLabel>
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
                                    name="endDate"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Batch End Date</FormLabel>
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
                                                        disabled={(date) => date < form.getValues().startDate}
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

                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({field}) => (
                                        <>
                                            <div className={'flex gap-3'}>
                                                <Checkbox id={'isActive'} checked={field.value}
                                                          onCheckedChange={field.onChange}/>
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor="isActive"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        Is Batch Active
                                                    </label>
                                                </div>
                                            </div>
                                            <FormMessage className={'text-xs'}/>
                                        </>
                                    )}
                                />
                                {/**/}

                                <Button type="submit" className={'w-full'} disabled={isLoading}>
                                    {isLoading && <Icon icon={'eos-icons:loading'} className={'h-5 w-5 mr-1'}/>} Save
                                    Egg Batch
                                </Button>
                            </form>
                        </Form>


                    </div>
                </div>
            </div>
        </div>
    )
}