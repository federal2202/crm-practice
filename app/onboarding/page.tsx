"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { OnboardingAction } from "../actions";
import { useForm } from "@conform-to/react"
import { parseWithZod } from "@conform-to/zod";
import { onboardingSchema } from "../lib/zodSchema";
import { SubmitButton } from "../components/SubmitButtons";

export default function OnboardingRoute(){
    const [lastResult, action] = useActionState(OnboardingAction, undefined);
    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}) {
            return parseWithZod(formData, {
                schema: onboardingSchema,
            })
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput'
    })
    console.log(fields.fullName)
    console.log(fields.userName)
    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome to Federal<span className="text-primary">CRM</span></CardTitle>
                    <CardDescription>
                        We need the following information to set up your profile!
                    </CardDescription>
                </CardHeader>
                <form action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
                    <CardContent className="grid gap-y-5 ">
                        <div className="grid gap-y-2">
                            <Label>Full Name</Label>
                            <Input placeholder="Fiodar Yermakow" name={fields.fullName.name} defaultValue={fields.fullName.initialValue} key={fields.fullName.key}/>
                            <p className="text-red-500 text-small">{fields.fullName.errors}</p>
                        </div>
                        <div className="grid gap-y-2">
                            <Label>Username</Label>
                            <div className="flex rounded-md">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-muted bg-muted text-small text-muted-foreground">FederalCRM.com/</span>
                                <Input placeholder="example-user-1" className="rounded-l-none" name={fields.userName.name} key={fields.userName.key} defaultValue={fields.userName.initialValue}/>
                                
                            </div>
                            <p className="text-red-500 text-small">{fields.userName.errors}</p>
                        </div>

                    </CardContent>
                    <CardFooter>
                        <SubmitButton text="Submit" className="w-full"/>
                    </CardFooter>
                </form>
                
            </Card>
        </div>
    )
}