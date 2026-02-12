const timestamp = new Date().toISOString();

export const formattedKrDate = new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium', timeStyle: 'short'
}).format(new Date())