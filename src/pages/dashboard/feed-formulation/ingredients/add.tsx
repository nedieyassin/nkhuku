import {Button} from "@/components/ui/button.tsx";
import {Icon} from "@iconify/react";
import {useNavigate, useParams} from "react-router-dom";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useEffect, useState} from "react";
import {isPrimaryKey, upsert} from "@/lib/utils.ts";
import pb from "@/lib/pocketbase.ts";
import useStore from "@/state";
import {useQuery} from "@tanstack/react-query";
import {Feed} from "@/pages/dashboard/configuration/feed/columns.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";


export type FormulaIngredient = {
    id: string
    formulaId: string
    feedId: string
    percentage: number
    expand: {
        feedId: {
            feedName: string
        }
    }
}

const formSchema = z.object({
    feedId: z.string().min(3),
    percentage: z.number().min(0.00001).max(100),
})

export default function FeedFormulaIngredientsAdd() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser} = useStore((state) => state);

    const {data: feedOptions} = useQuery({
        queryKey: ['feeds'],
        queryFn: () =>
            pb.collection('feeds').getFullList<Feed>({
                sort: '-created',
            }).then(r => r)
    })


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            feedId: '',
            percentage: 20
        },
    })


    useEffect(() => {
        if (params.id && isPrimaryKey(params.id)) {
            setIsLoading(true);
            pb.collection('formulaIngredients').getOne<FormulaIngredient>(params.id).then((record) => {
                form.setValue('feedId', record.feedId);
                form.setValue('percentage', record.percentage);
                setIsLoading(false);
            });
        }
    }, [params.id]);


    function onSubmit(form: z.infer<typeof formSchema>) {
        setIsLoading(true);
        if (params.id) {
            upsert('formulaIngredients', params.id, {
                ...form,
                formulaId: params.formulaId,
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
                    <h1 className={'font-bold text-xl md:text-3xl'}>Feed Formula</h1>
                </div>
                <div>
                    <div className={'py-4 max-w-screen-sm'}>

                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="feedId"
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
                                                        {feedOptions?.map((feed) => (
                                                            <SelectItem key={feed.id} value={feed.id}>
                                                                {feed.feedName}
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
                                    name="percentage"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Percentage (%)</FormLabel>
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
                                <Button type="submit" className={'w-full'} disabled={isLoading}>
                                    {isLoading && <Icon icon={'eos-icons:loading'} className={'h-5 w-5 mr-1'}/>} Save
                                    Formula Ingredient
                                </Button>
                            </form>
                        </Form>


                    </div>
                </div>
            </div>
        </div>
    )
}