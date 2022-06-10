import { useEffect, useState } from "react";

export const useTimer = (isPlay, speed) => {
    const [time, setTime] = useState(0);

    useEffect(() =>{
        if(isPlay){
            let inverval = setInterval(
                () => setTime(time + 10 * speed)
            , 10);
            return ()=> {
                clearInterval(inverval)
            };
        }
    })

    return [time, setTime]
};