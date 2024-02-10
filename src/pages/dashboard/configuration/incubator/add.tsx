import {Button} from "@/components/ui/button.tsx";
import {Icon} from "@iconify/react";
import {useNavigate, useParams} from "react-router-dom";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useEffect, useState} from "react";
import {isPrimaryKey, upsert} from "@/lib/utils.ts";
import pb from "@/lib/pocketbase.ts";
import useStore from "@/state";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Incubator} from "@/pages/dashboard/configuration/incubator/columns.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";

const formSchema = z.object({
    name: z.string().min(3),
    isExternal: z.boolean(),
    mobileNumber: z.string().optional(),
    description: z.string().optional(),
}).refine(data => {
    return !(data.isExternal && !data.mobileNumber);
}, {
    message: "Mobile number is required when incubator is external",
    path: ['mobileNumber'],
})

export default function IncubatorAdd() {
    const navigate = useNavigate();
    const params = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const {currentUser} = useStore((state) => state);


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            isExternal: false,
        },
    })


    useEffect(() => {
        if (params.id && isPrimaryKey(params.id)) {
            setIsLoading(true);
            pb.collection('incubators').getOne<Incubator>(params.id).then((record) => {
                form.setValue('name', record.name);
                form.setValue('isExternal', record.isExternal);
                form.setValue('mobileNumber', record.mobileNumber);
                form.setValue('description', record.description);
                setIsLoading(false);
            });
        }
    }, [params.id]);


    function onSubmit(form: z.infer<typeof formSchema>) {
        setIsLoading(true);
        if (params.id) {
            upsert('incubators', params.id, {
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
                    <h1 className={'font-bold text-xl md:text-3xl'}>Incubator</h1>
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
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage className={'text-xs'}/>
                                        </FormItem>
                                    )}
                                />
                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="isExternal"
                                    render={({field}) => (
                                        <>
                                            <div className={'flex gap-3'}>
                                                <Checkbox id={'isExternal'} checked={field.value}
                                                          onCheckedChange={field.onChange}/>
                                                <div className="grid gap-1.5 leading-none">
                                                    <label
                                                        htmlFor="isExternal"
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    >
                                                        This is an external incubator (not part of the farm)
                                                    </label>
                                                </div>
                                            </div>
                                            <FormMessage className={'text-xs'}/>
                                        </>
                                    )}
                                />
                                {/**/}
                                {form.watch('isExternal') && <FormField
                                    control={form.control}
                                    name="mobileNumber"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Incubator Contact Mobile Number</FormLabel>
                                            <FormControl>
                                                <Input type={'tel'} {...field} />
                                            </FormControl>
                                            <FormMessage className={'text-xs'}/>
                                        </FormItem>
                                    )}
                                />}

                                {/**/}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
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
                                    Incubator
                                </Button>
                            </form>
                        </Form>


                    </div>
                </div>
            </div>
        </div>
    )
}