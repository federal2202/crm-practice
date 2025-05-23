import { Calendar } from "@/app/components/bookingForm/Calendar";
import { RenderCalendar } from "@/app/components/bookingForm/RenderCalendar";
import prisma from "@/app/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarX2, Clock, VideoIcon } from "lucide-react";
import { notFound } from "next/navigation";


async function getData(eventUrl: string, userName: string){
    const data = await prisma.eventType.findFirst({
        where: {
            url: eventUrl,
            User: {
                userName: userName,
            },
            active: true,
        },
        select: {
            id: true,
            description: true,
            title: true,
            duration: true,
            videoCallSoftware: true,
            User: {
                select: {
                    image: true,
                    name: true,
                    availability: {
                        select: {
                            day: true,
                            isActive: true,
                        },
                    },
                },
            },
        },
    });
    if(!data){
        return notFound();
    }
    return data;

}


export default async function BookingFormRoute({params, searchParams}: 
    {
        params: {username: string; eventUrl: string;};
        searchParams: {date?: string}
    }) {
    const data = await getData(params.eventUrl, params.username);
    const selectedDate = searchParams.date ? new Date(searchParams.date) : new Date();
    const formattedDate = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
    }).format(selectedDate)
    return (
        <div className="min-h-screen w-screen flex items-center justify-center">
            <Card className="max-w-[1000px] w-full mx-auto">
                <CardContent className="p-5 md:grid md:grid-cols-[1fr,auto,1fr,auto,1fr] md:gap-4">
                    <div>
                        <img src={data.User?.image as string} alt="Profile image of user" className="size-10 rounded-full"/>
                        <p className="text-sm font-medium text-muted-foreground mt-1">{data.User?.name}</p>
                        <h1 className="text-xl font-semibold mt-2">{data.title}</h1>
                        <p className="text-sm font-medium text-muted-foreground">{data.description}</p>
                        <div className="mt-5 flex flex-col gap-y-3">
                            <p className="flex items-center">
                                <CalendarX2 className="size-4 mr-2 text-primary"/>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {formattedDate}
                                </span>
                            </p>
                            <p className="flex items-center">
                                <Clock className="size-4 mr-2 text-primary"/>
                                <span className="text-sm font-medium text-muted-foreground">{data.duration} Minutes</span>
                            </p>
                            <p className="flex items-center">
                                <VideoIcon className="size-4 mr-2 text-primary"/>
                                <span className="text-sm font-medium text-muted-foreground">{data.videoCallSoftware}</span>
                            </p>
                        </div>
                    </div>
                    <Separator orientation="vertical" className="h-full w-[1px] hidden md:block"/>
                    <Calendar />
                    <div className="my-4 md:my-0">
                        <RenderCalendar daysofWeek={data.User?.availability as any} />
                    </div>

                    <Separator
                    orientation="vertical"
                    className="hidden md:block h-full w-[1px]"
                    />
                </CardContent>
            </Card>
        </div>
    )
}
