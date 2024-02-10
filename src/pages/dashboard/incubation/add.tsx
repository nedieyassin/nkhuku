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
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {format, addDays} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Incubator} from "@/pages/dashboard/configuration/incubator/columns.tsx";
import {EggIncubation} from "@/pages/dashboard/incubation/columns.tsx";

const formSchema = z.object({
    incubatorId: z.string().min(3),
    noOfEggs: z.number().min(1),
    startDate: z.date(),
    endDate: z.date(),
    notes: z.string().optional(),
})

export default function EggIncubationAdd() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser} = useStore((state) => state);

    const {data: incubatorOptions} = useQuery({
        queryKey: ['incubators'],
        queryFn: () =>
            pb.collection('incubators').getFullList<Incubator>({
                sort: 'name',
            }).then(r => r)
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            noOfEggs: 0
        }
    })


    useEffect(() => {
        if (params.id && isPrimaryKey(params.id)) {
            setIsLoading(true);
            pb.collection('eggIncubations').getOne<EggIncubation>(params.id).then((record) => {
                form.setValue('incubatorId', record.incubatorId);
                form.setValue('noOfEggs', record.noOfEggs);
                form.setValue('startDate', new Date(record.startDate || new Date()));
                form.setValue('endDate', new Date(record.endDate || new Date()));
                form.setValue('notes', record.notes);

                setIsLoading(false);
            });
        }
    }, [params.id]);


    function onSubmit(form: z.infer<typeof formSchema>) {
        setIsLoading(true);
        if (params.id) {
            upsert('eggIncubations', params.id, {
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
                    <h1 className={'font-bold text-xl md:text-3xl'}>Egg Incubation</h1>
                </div>
                <div>
                    <div className={'py-4 max-w-screen-sm'}>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="incubatorId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Incubator</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a Incubator"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {incubatorOptions?.map((incubator) => (
                                                            <SelectItem key={incubator.id} value={incubator.id}>
                                                                {incubator.name}
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
                                    name="noOfEggs"
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
                                            <FormLabel>Incubation Start Date</FormLabel>
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
                                                                format(field.value, "dd MMM, yyyy")
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
                                                        onSelect={(value) => {
                                                            field.onChange(value);
                                                            (!form.getValues('endDate') && value) && form.setValue('endDate', addDays(value, 21))
                                                        }}
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
                                            <FormLabel>Expected Incubation End Date</FormLabel>
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
                                                                format(field.value, "dd MMM, yyyy")
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

                                {/**/}

                                <Button type="submit" className={'w-full'} disabled={isLoading}>
                                    {isLoading && <Icon icon={'eos-icons:loading'} className={'h-5 w-5 mr-1'}/>} Save
                                    Egg Incubation
                                </Button>
                            </form>
                        </Form>


                    </div>
                </div>
            </div>
        </div>
    )
}