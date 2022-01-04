// let styles = new Map();
// styles.set(1, "Synthwave"); // 23 steps
// styles.set(2, "Ukiyoe");
// styles.set(3, "No Style");
// styles.set(4, "Steampunk"); // 24 steps
// styles.set(5, "Fantasy Art");
// styles.set(6, "Vibrant");
// styles.set(7, "HD");
// styles.set(8, "Pastel");
// styles.set(9, "Psychic");
// styles.set(10, "Dark Fantasy");
// styles.set(11, "Mystical");
// styles.set(12, "Festive");
// styles.set(13, "Baroque");
// styles.set(14, "Etching");

import { Avatar } from '@material-ui/core';


export enum GenerationType {
    Synthwave = '1',
    Ukiyoe = '2',
    NoStyle = '3',
    Steampunk = '4',
    FantasyArt = '5',
    Vibrant = '6',
    HD = '7',
    Pastel = '8',
    Psychic = '9',
    DarkFantasy = '10',
    Mystical = '11',
    Festive = '12',
    Baroque = '13',
    Etching = '14'
}

export const generationTypeDisplay = {
    [GenerationType.Synthwave]: <><Avatar src={`generationTypes/${'Synthwave'}.jpeg`} />Synthwave</>,
    [GenerationType.Ukiyoe]: <><Avatar src={`generationTypes/${'Ukiyoe'}.jpeg`} />Ukiyoe</>,
    [GenerationType.NoStyle]: <><Avatar src={`generationTypes/${'No style'}.jpeg`} />No style</>,
    [GenerationType.Steampunk]: <><Avatar src={`generationTypes/${'Steampunk'}.jpeg`} />Steampunk</>,
    [GenerationType.FantasyArt]: <><Avatar src={`generationTypes/${'Fantasy art'}.jpeg`} />Fantasy art</>,
    [GenerationType.Vibrant]: <><Avatar src={`generationTypes/${'Vibrant'}.jpeg`} />Vibrant</>,
    [GenerationType.HD]: <><Avatar src={`generationTypes/${'Hd'}.jpeg`} />Hd</>,
    [GenerationType.Pastel]: <><Avatar src={`generationTypes/${'Pastel'}.jpeg`} />Pastel</>,
    [GenerationType.Psychic]: <><Avatar src={`generationTypes/${'Psychic'}.jpeg`} />Psychic</>,
    [GenerationType.DarkFantasy]: <><Avatar src={`generationTypes/${'Dark fantasy'}.jpeg`} />Dark fantasy</>,
    [GenerationType.Mystical]: <><Avatar src={`generationTypes/${'Mystical'}.jpeg`} />Mystical</>,
    [GenerationType.Festive]: <><Avatar src={`generationTypes/${'Festive'}.jpeg`} />Festive</>,
    [GenerationType.Baroque]: <><Avatar src={`generationTypes/${'Baroque'}.jpeg`} />Baroque</>,
    [GenerationType.Etching]: <><Avatar src={`generationTypes/${'Etching'}.jpeg`} />Etching</>
};
