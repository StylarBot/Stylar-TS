function splitter(str: string, l: number): string[] {
    var strs: string[] = [];
    str = str.replace(/[\s\r\n]+/, ' ');
    while (str.length > l) {
        var pos = str.substring(0, l).lastIndexOf(' ');
        pos = pos <= 0 ? l : pos;
        strs.push(str.substring(0, pos));
        var i = str.indexOf(' ', pos) + 1;
        if (i < pos || i > pos + l)
            i = pos;
        str = str.substring(i);
    }
    strs.push(str);
    return strs;
}