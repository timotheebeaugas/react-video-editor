import { useEffect, useState } from "react";

export function useTimer(isPlay, speed) {
    const [time, setTime] = useState(0);

    useEffect(() =>{
        if(isPlay){
            let inverval = setInterval(
                () => setTime(time + 100 * speed)
            , 10);
            return ()=> {
                clearInterval(inverval)
            };
        }
    })

    return [time]
};