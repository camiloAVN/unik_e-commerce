import { auth } from "@/auth"
import { redirect } from "next/navigation";



export default async function ProfilePage(){

    const session = await auth();

    if(!session?.user){
        redirect('/');
    }

    return(
        <div className="w-full h-screen">
            <pre className="text-white">
                {JSON.stringify(session.user, null, 2)}
                <h3>
                    {session.user.role}
                </h3>
            </pre>

        </div>
    )
}