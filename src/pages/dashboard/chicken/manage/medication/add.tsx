import {Button} from "@/components/ui/button.tsx";
import {Icon} from "@iconify/react";
import {useNavigate, useParams} from "react-router-dom";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useEffect, useState} from "react";
import {cn, isPrimaryKey, upsert} from "@/lib/utils.ts";
import pb from "@/lib/pocketbase.ts";
import useStore from "@/state";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Input} from "@/components/ui/input.tsx";


export type Medication = {
    id: string
    chickenBatchId: string
    noOfChickens: number
    date: string
    reason: string
    notes: string
}

const formSchema = z.object({
    noOfChickens: z.number().min(1),
    date: z.date(),
    reason: z.string().min(3),
    notes: z.string().optional(),
})

export default function MovementAdd() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser} = useStore((state) => state);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            noOfChickens: 1,
            date: new Date(),
            reason: '',
            notes: '',
        },
    })


    useEffect(() => {
        if (params.id && isPrimaryKey(params.id)) {
            setIsLoading(true);
            pb.collection('chickenMovements').getOne<Medication>(params.id).then((record) => {
                form.setValue('noOfChickens', record.noOfChickens);
                form.setValue('reason', record.reason);
                form.setValue('date', new Date(record.date));
                form.setValue('notes', record.notes);
                setIsLoading(false);
            });
        }
    }, [params.id]);


    function onSubmit(form: z.infer<typeof formSchema>) {
        setIsLoading(true);
        if (params.id) {
            upsert('chickenMovements', params.id, {
                ...form,
                chickenBatchId: params.chickenId,
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
                    <h1 className={'font-bold text-xl md:text-3xl'}>Movement Log</h1>
                </div>
                <div>
                    <div className={'py-4 max-w-screen-sm'}>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="noOfChickens"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>No Of Chickens</FormLabel>
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
                                    name="date"
                                    render={({field}) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Date</FormLabel>
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
                                    name="reason"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Movement Reason</FormLabel>
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
                                    Movement
                                </Button>
                            </form>
                        </Form>


                    </div>
                </div>
            </div>
        </div>
    )
}