import { NextResponse } from 'next/server';
import { parse } from 'node-html-parser';
import { MACAU_BUS_URL } from '@/const';

// GET request
export async function GET (request){
    // get bus route name from query
    const { searchParams } = new URL(request.url)
    const route = searchParams.get('route')

    // get bus route info from MACAU BUS URL
    const res = await fetch("https://bis.dsat.gov.mo:37812/macauweb/routestation/bus", {
        "headers": {
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "token": "d3272023d8b8b3b210167a7d3777ce3f1252aaa83b3a",
        },
        "body": "action=dy&routeName=701X&dir=0&lang=zh-tw&device=web",
        "method": "POST"
      });
    const j=await res.json();
    return new NextResponse(JSON.stringify(j))
}