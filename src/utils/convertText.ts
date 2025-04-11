export const convertText = (text: string) => {
  if (text === undefined) return '';

  while (true) {
    if (text.startsWith("\n")) text = text.substring(1);
    else break;
  }

  text = text.replace(
    /<br> <br>|<br> \n|<br>\n\n|<br><br>|<br>\n|\n\n|<br>|<br\/>|<br >|<br \/>/g,
    "\n"
  );
  return text;
};
