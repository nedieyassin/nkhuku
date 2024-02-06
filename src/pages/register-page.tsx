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
import pb from "@/lib/pocketbase.ts";
import {useState} from "react";
import {toast} from "sonner"
import {useNavigate} from "react-router-dom";
import {Checkbox} from "@/components/ui/checkbox.tsx";


const formSchema = z.object({
    fullName: z.string().min(1).trim(),
    farmName: z.string().optional(),
    username: z.string().email().trim().toLowerCase(),
    password: z.string().min(8).trim(),
    confirmPassword: z.string().min(8).trim(),
    agree: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
}).refine((data) => data.agree, {
    message: "Please agree to the terms and conditions",
    path: ["agree"]
});

export default function RegisterPage() {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: "",
            farmName: "",
            username: "",
            password: "",
            confirmPassword: "",
            agree: false,
        },
    })
    const [isLoading, setIsLoading] = useState(false);

    function onSubmit(form: z.infer<typeof formSchema>) {
        setIsLoading(true)
        pb.collection('users').create({
            email: form.username,
            emailVisibility: true,
            password: form.password,
            passwordConfirm: form.confirmPassword,
            name: form.fullName,
            farmName: form.farmName,
        }).then(() => {
            setIsLoading(false);
            navigate({pathname: '/login', search: '?register=true&email=' + form.username});
        }).catch((res) => {
            toast.error("Something went wrong", {
                description: res?.response?.data?.email?.message ?? "Please try again",
            })
            setIsLoading(false);
        });
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
                            name="farmName"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Farm Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your farm name" {...field} />
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
                                        <Input placeholder="Enter your password" type={'password'} {...field} />
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
                                        <Input placeholder="Confirm your password" type={'password'} {...field} />
                                    </FormControl>
                                    <FormMessage className={'text-xs'}/>
                                </FormItem>
                            )}
                        />
                        {/**/}
                        <FormField
                            control={form.control}
                            name="agree"
                            render={({field}) => (
                                <>
                                    <div className={'flex gap-3'}>
                                        <Checkbox id={'agree'} checked={field.value}
                                                  onCheckedChange={field.onChange}/>
                                        <div className="grid gap-1.5 leading-none">
                                            <label
                                                htmlFor="agree"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Accept terms and conditions
                                            </label>
                                            <p className="text-sm text-muted-foreground">
                                                You agree to our <Link className={'text-blue-500 hover:underline'} to={'/'}>Terms of Service and Privacy
                                                Policy</Link>.
                                            </p>
                                        </div>
                                    </div>
                                    <FormMessage className={'text-xs'}/>
                                </>
                            )}
                        />
                        {/**/}
                        <Button type="submit" className={'w-full'} disabled={isLoading}>
                            {isLoading && <Icon icon={'eos-icons:loading'} className={'h-5 w-5 mr-1'}/>} Register
                        </Button>
                        <div>
                            <p className={'text-center text-sm'}>Already have an account? <Link
                                to={'/login'} className={'text-blue-500 hover:underline'}>Login</Link></p>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}