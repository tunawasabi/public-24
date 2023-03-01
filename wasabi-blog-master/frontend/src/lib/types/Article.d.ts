export default interface Article {
    id: string,
    slug: string,
    eye_catch?: string,
    title: string,
    content: string,
    created_date?: any,
    last_updated_date?: any,
    published: boolean,
    tags: string[]
}
