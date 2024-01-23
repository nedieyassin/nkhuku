import {Icon} from "@iconify/react";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {Link} from "react-router-dom";

const formSchema = z.object({
    fullName: z.string().min(1).trim(),
    username: z.string().email().trim().toLowerCase(),
    password: z.string().min(8).trim(),
    confirmPassword: z.string().min(8).trim()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export default function RegisterPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            username: "",
            password: "",
            confirmPassword: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return (
        <div className={'w-full flex-col min-h-screen flex items-center justify-center px-4'}>

            <div className={'space-y-2'}>
                <Link to={'/'} className={'flex flex-col items-center justify-center gap-1'}>
                    <Icon icon={'fluent-emoji-high-contrast:chicken'} className={'h-10 w-10'}/>
                    <h1 className={'text-2xl font-bold'}>NKHUKU</h1>
                </Link>
                <div>
                    <h2 className={'font-semibold text-center text-xl'}>Register your account</h2>
                </div>
            </div>
            <div className={'py-4 w-full md:max-w-96'}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/**/}
                        <FormField
                            control={form.control}
                            name="fullName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your full name" {...field} />
                                    </FormControl>
                                    <FormMessage className={'text-xs'}/>
                                </FormItem>
                            )}
                        />
                        {/**/}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field} />
                                    </FormControl>
                                    <FormMessage className={'text-xs'}/>
                                </FormItem>
                            )}
                        />
                        {/**/}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your password" {...field} />
                                    </FormControl>
                                    <FormMessage className={'text-xs'}/>
                                </FormItem>
                            )}
                        />
                        {/**/}
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Confirm your password" {...field} />
                                    </FormControl>
                                    <FormMessage className={'text-xs'}/>
                                </FormItem>
                            )}
                        />
                        {/**/}
                        <Button type="submit" className={'w-full'}>Register</Button>
                        <div>
                            <p className={'text-center text-sm'}>Already have an account? <Link
                                to={'/login'} className={'text-blue-500'}>Login</Link></p>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}