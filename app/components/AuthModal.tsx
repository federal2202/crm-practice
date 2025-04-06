import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import Logo from "@/public/logo.png";
import { signIn } from "../lib/auth";
import { GitHubAuthButton, GoogleAuthButton } from "./SubmitButtons";

export function AuthModal(){
    return (
        <Dialog>
            <DialogTrigger>
                <Button>Try For Free</Button>
            </DialogTrigger>
            <DialogTitle className="hidden">CRM</DialogTitle>
            <DialogContent className="sm:max-w-[360px]">
                <DialogHeader className="flex items-center gap-2 flex-row justify-center">
                    <Image src={Logo} alt="modal Logo" className="size-10"/>
                    <h4 className="text-3xl font-semibold">
                        Federal<span className="text-primary">CRM</span>
                    </h4>
                </DialogHeader>
                <div className="flex flex-col mt-5 gap-3">
                    <form className="w-full" action={async () => {
                        "use server";
                        await signIn("google");
                    }}>
                        <GoogleAuthButton />
                    </form>             
                    <form className="w-full" action={async () => {
                        "use server";
                        await signIn("github");
                    }}>
                        <GitHubAuthButton />
                    </form>             
                    
                </div>
            </DialogContent>
        </Dialog>
    )
}