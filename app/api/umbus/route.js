import { NextResponse } from "next/server";
import { UM_BUS_URL } from "@/const";
import { parse } from 'node-html-parser';

export async function GET(){
    const res = await fetch(UM_BUS_URL, {
        "headers": {
          "x-requested-with": "XMLHttpRequest",
        },
        cache: "no-store",
      });
    console.log(res)
    const html = await res.json();
    const root = parse(html['_tapestry']['content'][0][1])

    const busStops = root.querySelectorAll('span')
        .map(span => span.text)
    const infoNum = busStops.length >= 12 ? 4 : 3;

    const infoList=busStops.slice(0,infoNum);
    const busList=busStops.slice(infoNum).filter((bus)=>bus[0]!='M');


    const busLeft = root.querySelectorAll('.left')
        .map(left => {
            return left.text.replace(/[\t\n]/g, '')
        })
    
    const busPos=busLeft.map((bus)=>{
        if (bus.length>0){
            return {
                bus:bus,
                pos:busLeft.indexOf(bus)
            }
        }
    }).filter((bus)=>bus!=undefined)
    // if busPos is even, it means the bus is on the station BusList[busPos/2]
    // else the bus is on the way from BusList[Math.floor(busPos/2)] to BusList[Math.ceil(busPos/2)]

    const busCurStatue=busPos.map((bus)=>{
        if (bus.pos%2==0){
            return {
                bus:bus.bus,
                curStatue:busList[bus.pos/2]
            }
        }else{
            return {
                bus:bus.bus,
                curStatue:busList[Math.floor(bus.pos/2)]+'-'+busList[Math.ceil(bus.pos/2)]
            }
        }
    })

    return new NextResponse(JSON.stringify({busCurStatue,busPos,infoList,busList,busStops}))
}