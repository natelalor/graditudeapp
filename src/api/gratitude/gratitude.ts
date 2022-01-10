import { doCustomQuery, Gratitude } from '../../database/db';


export function searchGratitudesByTags(tags: string[]) {
    return doCustomQuery('Gratitude', tags.map(tag => ({
        propertyName: 'tags',
        propertyValue: tag,
        type: 'AND'
    }))) as Promise<Gratitude[]>;
}
