import { useState } from "react";

export interface HatProps {
    thread: string;
    size: string;
    defaultQ?: number;
    defaultQ2?: number;
}

export function Hat({ thread, size, defaultQ = 0, defaultQ2 = 20 }: HatProps) {
    const [quantity, setQuantity] = useState(defaultQ);

    function handleClick() {
        setQuantity(quantity+1);
    }

    return (
        <div>
            I am a hat made of {thread}, size {size}
            <button onClick={handleClick}>{quantity}</button>
        </div>
    )
}


// this is my change
export function Bomba() {
    return (
        <p>bomba cites.</p>
    )
}