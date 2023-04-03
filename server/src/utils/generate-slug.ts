export const generateSlug = (str: string): string => {
	let slug;

	slug = str.toLowerCase();

	slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');

	slug = slug.replace(/ /gi, "-");

	slug = slug.replace(/\-\-\-\-\-/gi, '-');
	slug = slug.replace(/\-\-\-\-/gi, '-');
	slug = slug.replace(/\-\-\-/gi, '-');
	slug = slug.replace(/\-\-/gi, '-');

	slug = '@' + slug + '@';
	slug = slug.replace(/\@\-|\-\@|\@/gi, '');
	return slug;
};