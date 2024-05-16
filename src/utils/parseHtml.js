import { decode } from 'html-entities';
const parseFromHtml = (htmlString) => {
    const text = htmlString.replace(/<[^>]*>/g, '');
    return decode(text);
};
export default parseFromHtml;