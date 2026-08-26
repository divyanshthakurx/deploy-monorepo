import {prisma} from "db/client";

export default async function Home() {

  const users = await prisma.user.findMany();
  const todos = await prisma.todo.findMany();

  return (
    <div>
      {JSON.stringify(users)}
      {JSON.stringify(todos)}
    </div>
  );
}


export const dynamic = 'force-dynamic';

// OR 

// export const revalidate =  60;   // revalidate page every 60 seconds