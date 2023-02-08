export default interface Article {
    slug: string,
    eye_catch?: string,
    title: string,
    content: string,
    created_date?: any,
    last_updated_date?: any,
    published: boolean,
    tags: string[]
}
