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
import {useQuery} from "@tanstack/react-query";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {FeedFormulation} from "@/pages/dashboard/feed-formulation/columns.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";


export type FeedLog = {
    id: string
    chickenBatchId: string
    feedFormulaId: string
    feedDate: string
    feedTime: string
    quantity: number
    notes: string
    expand: {
        feedFormulaId: {
            formulaName: string
        }
    }
}

const formSchema = z.object({
    feedFormulaId: z.string().min(3),
    feedDate: z.date(),
    feedTime: z.string(),
    quantity: z.number().min(1),
    notes: z.string().optional(),
})

export default function FeedingAdd() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser} = useStore((state) => state);


    // console.log('formulaIngredients', formulaFeeds)

    const {data: feedFormulas} = useQuery({
        queryKey: ['feedFormulas'],
        queryFn: () =>
            pb.collection('feedFormulas').getFullList<FeedFormulation>({
                sort: '-created',
            }).then(r => r)
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            feedTime: '',
            quantity: 0,
            feedFormulaId: ''
        },
    })


    useEffect(() => {
        if (params.id && isPrimaryKey(params.id)) {
            setIsLoading(true);
            pb.collection('feedingLogs').getOne<FeedLog>(params.id).then((record) => {
                form.setValue('feedFormulaId', record.feedFormulaId);
                form.setValue('feedDate', new Date(record.feedDate));
                form.setValue('feedTime', record.feedTime);
                form.setValue('quantity', record.quantity);
                form.setValue('notes', record.notes);
                setIsLoading(false);
            });
        }
    }, [params.id]);


    function onSubmit(form: z.infer<typeof formSchema>) {
        setIsLoading(true);
        if (params.id) {
            upsert('feedingLogs', params.id, {
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
                    <h1 className={'font-bold text-xl md:text-3xl'}>Feed Log</h1>
                </div>
                <div>
                    <div className={'py-4 max-w-screen-sm'}>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="feedFormulaId"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Feed</FormLabel>
                                            <FormControl>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a feed"/>
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {feedFormulas?.map((feed) => (
                                                            <SelectItem key={feed.id} value={feed.id}>
                                                                {feed.formulaName}
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
                                    name="feedDate"
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
                                    name="feedTime"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Time</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type={'time'}
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
                                    name="quantity"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Quantity</FormLabel>
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
                                    Feed Log
                                </Button>
                            </form>
                        </Form>


                    </div>
                </div>
            </div>
        </div>
    )
}