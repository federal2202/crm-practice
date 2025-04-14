"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./SubmitButtons";
import { useActionState, useState } from "react";
import { SettingsAction } from "../actions";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { settingsSchema } from "../lib/zodSchema";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UploadButton, UploadDropzone } from "../lib/uploadthing";
import { OurFileRouter } from "../api/uploadthing/core";
import { toast } from "sonner";

interface iAppProps {
    fullName: string;
    email: string;
    profileImage: string;
}

export default function SettingsForm({ email, fullName, profileImage}: iAppProps){
    const [lastResult, action]  = useActionState(SettingsAction, undefined);
    const [currentProfileImage, setCurrentProfileImage] = useState(profileImage)
    const [form, fields] = useForm({
        lastResult,
        onValidate({formData}){
            return parseWithZod(formData, {
                schema: settingsSchema,
            })
        },
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput'
    })
    const handleDeleteimage = () => {
        setCurrentProfileImage("")
    }
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Settings</CardTitle>
                    <CardDescription>Manage your account settings!</CardDescription>
                </CardHeader>
                <form action={action} id={form.id} onSubmit={form.onSubmit} noValidate>
                    <CardContent className="flex flex-col gap-y-4">
                        <div className="flex flex-col gap-y-2">
                            <Label>Full Name</Label>
                            <Input placeholder="Fiodar Yermakou" defaultValue={fullName} name={fields.fullName.name} key={fields.fullName.key}/>
                            <p className="text-red-500 text-small">{fields.fullName.errors}</p>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <Label>Email</Label>
                            <Input placeholder="test@test.com" defaultValue={email} disabled/>
                        </div>
                        <div className="grid gap-y-5">
                            <Label>Profile Image</Label>
                            <input type="hidden" name={fields.profileImage.name} key={fields.profileImage.key} value={currentProfileImage}/>
                            {currentProfileImage ? (
                                <div className="relative size-16">
                                    <img src={currentProfileImage} alt="Profile image" className="size-16 rounded-lg"/>
                                    <Button variant="destructive" size="icon" className="absolute -top-3 -right-3" onClick={handleDeleteimage} type="button">
                                        <X className="size-4"/>
                                    </Button>
                                </div>
                            ): (
                                <UploadButton endpoint="imageUploader" onClientUploadComplete={(res) => {
                                    console.log("done");
                                    setCurrentProfileImage(res?.[0]?.ufsUrl);
                                    toast.success("profile image has been uploaded")
                                }} className="w-full h-40 border-2 border-dashed border-gray-400 flex items-center justify-center text-sm text-gray-600" 
                                onUploadError={(error) => {
                                    console.log("something went wrong");
                                    toast.error(error.message)
                                }}
                                />
                            )}
                            <p className="text-red-500 text-small">{fields.profileImage.errors}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="mt-3">
                        <SubmitButton text="Save Changes"/>
                    </CardFooter>
                </form>
            </Card>
            
        </>
    )
}