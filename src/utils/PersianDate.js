export default class PersianDate {
    constructor(p1, p2, p3, p4, p5, p6) {
        this.year = 0;
        this.month = 0;
        this.day = 0;
        this.hour = 0;
        this.minute = 0;
        this.second = 0;

        // initialize empty parameters with NOW value
        if (p1 == undefined) {
            var gDate = new Date();
            var pd = toPersianDate(gDate.getFullYear(), gDate.getMonth()+1, gDate.getDate());
            this.setYear(pd.year, pd.month, pd.day);
            this.setHours(gDate.getHours(), gDate.getMinutes(), gDate.getSeconds());
        }
        // initialize with date object
        else if (p1 instanceof Date) {
            var gDate = p1;
            var pd = toPersianDate(gDate.getFullYear(), gDate.getMonth()+1, gDate.getDate());
            this.setYear(pd.year, pd.month, pd.day);
            this.setHours(gDate.getHours(), gDate.getMinutes(), gDate.getSeconds());
        }
        // initialize with another instance of the same class
        else if (p1 instanceof PersianDate) {
            this.setYear(p1.year, p1.month, p1.day);
            this.setHours(p1.hour, p1.minute, p1.second);
        }
        // initialize with getTime() miliseconds value
        else if (!isNaN(p1) && p2 == undefined && p3 == undefined) {
            var gDate = new Date(p1);
            var pd = toPersianDate(gDate.getFullYear(), gDate.getMonth()+1, gDate.getDate());
            this.setYear(pd.year, pd.month, pd.day);
            this.setHours(gDate.getHours(), gDate.getMinutes(), gDate.getSeconds());
        }
        // initialize with persian date string
        else if (typeof p1 === 'string') {
            var valueSplit = String(p1).split('/');
            this.setYear(parseInt(valueSplit[0]), parseInt(valueSplit[1]), parseInt(valueSplit[2]));
        }
        // initialize with persian year,month,day,hour,minute,second
        else if (!isNaN(p1) && !isNaN(p2)) {
            this.setYear(p1, p2, p3);
            if (p4 != undefined) this.setHours(p4, p5, p6);
        }
    }

    // private methods

    _getTwoDigitsString(number) {
        return (number < 10 && number >= 0 ? '0' : '') + String(number);
    }

    // public methods

    isLeap() {
        return hshIsLeap(this.year);
    }
    getWeekDay() {
        return hshDayOfWeek(this.year, this.month, this.day);
    }
    getWeekDayName() {
        return hshDayName(this.getWeekDay());
    }
    getFullDate() {
        return this.getWeekDayName() + " " + this.day + " " + calNames("hf", this.month - 1) + " " + this.year;
    }
    getShortDate() {
        return this.year +'/'+ this._getTwoDigitsString(this.month) +'/'+ this._getTwoDigitsString(this.day)
    }
    getGregorian() {
        var gDate = toGregorianDate(this.year, this.month, this.day);
        gDate.setHours(this.hour, this.minute, this.second, 0);
        return gDate;
    }

    toString() {
        return this.getShortDate();
    }
    toDate() {
        return toGregorianDate(this.year, this.month, this.day);
    }

    // javascript date object methods

    getDate() { return this.day }
    getMonth() { return this.month }
    getYear() { return this.year - 1900 }
    getFullYear() { return this.year }
    getDay() { return this.getWeekDay() }
    getHours() { return this.hour }
    getMinutes() { return this.minute }
    getSeconds() { return this.second }
    getTime() {
        return this.getGregorian().getTime();
    }
    setDate(value) {
        if (value >= 1 && value <= 31)
            this.day = value;
        else if (value == 0) {
            if (this.month > 1)
                this.month--;
            else {
                this.month = 12;
                this.year--;
            }
            
            this.day = (this.month >= 1 && this.month <= 6) ? 31 : 30;
        }

        return this;
    }
    setMonth(month, day) {
        if (month >= 1 && month <= 12) {
            this.month = month;
        } else if (month == 0) {
            this.month = 12;
            this.year--;
        }

        if (day !== undefined)
            this.setDate(day);

        return this;
    }
    setYear(year, month, day) {
        this.year = year;

        if (month !== undefined)
            this.setMonth(month, day);

        return this;
    }
    setHours(hour, minute, second) {
        this.hour = hour;
        if (minute != undefined) this.minute = minute;
        if (second != undefined) this.second = second;
        return this;
    }
    setMinutes(minute, second) {
        this.minute = minute;
        if (second != undefined) this.second = second;
    }
    setSeconds(second) {
        this.second = second;
    }

    // static methods

    static fromGregorianDate(gregorianDateObjectOrString) {
        var gDate = new Date();
        if (gregorianDateObjectOrString) {
            if (Object.prototype.toString.call(gregorianDateObjectOrString) === '[object Date]')
                gDate = gregorianDateObjectOrString;
            else
                gDate = new Date(gregorianDateObjectOrString);
        }
        var pd = toPersianDate(gDate.getFullYear(), gDate.getMonth()+1, gDate.getDate());
        pd.setHours(gDate.getHours(), gDate.getMinutes(), gDate.getSeconds());
        return pd;
    }

    static fromPersianDate(value) {
        var valueSplit = String(value).split('/');
        return new PersianDate(parseInt(valueSplit[0]), parseInt(valueSplit[1]), parseInt(valueSplit[2]));
    }
    
    static fromGetTime(miliseconds) {
        var gDate = new Date(miliseconds);
        var pd = toPersianDate(gDate.getFullYear(), gDate.getMonth()+1, gDate.getDate());
        pd.setHours(gDate.getHours(), gDate.getMinutes(), gDate.getSeconds());
        return pd;
    }
    
    static create(year, month, day) {
        return new PersianDate(year, (month >= 0 ? month : 1), (day >= 0 ? day : 1));
    }
    
    static now() {
        var gDate = new Date();
        var pd = toPersianDate(gDate.getFullYear(), gDate.getMonth()+1, gDate.getDate());
        pd.setHours(gDate.getHours(), gDate.getMinutes(), gDate.getSeconds());
        return pd;
    }
    
    static isPersianDateInstance(value) {
        return value instanceof PersianDate;
    }
}

// private codes

var grgSumOfDays = Array(Array(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365), Array(0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366));
var hshSumOfDays = Array(Array(0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 365), Array(0, 31, 62, 93, 124, 155, 186, 216, 246, 276, 306, 336, 366));

function toPersianDate(grgYear, grgMonth, grgDay) {
    var hshYear = grgYear - 621;
    var hshMonth, hshDay;

    var grgLeap = grgIsLeap(grgYear);
    var hshLeap = hshIsLeap(hshYear - 1);

    var hshElapsed;
    var grgElapsed = grgSumOfDays[(grgLeap ? 1 : 0)][grgMonth - 1] + grgDay;

    var XmasToNorooz = (hshLeap && grgLeap) ? 80 : 79;

    if (grgElapsed <= XmasToNorooz) {
        hshElapsed = grgElapsed + 286;
        hshYear--;
        if (hshLeap && !grgLeap)
            hshElapsed++;
    }
    else {
        hshElapsed = grgElapsed - XmasToNorooz;
        hshLeap = hshIsLeap(hshYear);
    }

    for (var i = 1; i <= 12 ; i++) {
        if (hshSumOfDays[(hshLeap ? 1 : 0)][i] >= hshElapsed) {
            hshMonth = i;
            hshDay = hshElapsed - hshSumOfDays[(hshLeap ? 1 : 0)][i - 1];
            break;
        }
    }

    return { year: hshYear, month: hshMonth, day: hshDay };
}

function toGregorianDate(hshYear, hshMonth, hshDay) {
    var grgYear = hshYear + 621;
    var grgMonth, grgDay;

    var hshLeap = hshIsLeap(hshYear);
    var grgLeap = grgIsLeap(grgYear);

    var hshElapsed = hshSumOfDays[hshLeap ? 1 : 0][hshMonth - 1] + hshDay;
    var grgElapsed;

    if (hshMonth > 10 || (hshMonth == 10 && hshElapsed > 286 + (grgLeap ? 1 : 0))) {
        grgElapsed = hshElapsed - (286 + (grgLeap ? 1 : 0));
        grgLeap = grgIsLeap(++grgYear);
    }
    else {
        hshLeap = hshIsLeap(hshYear - 1);
        grgElapsed = hshElapsed + 79 + (hshLeap ? 1 : 0) - (grgIsLeap(grgYear - 1) ? 1 : 0);
    }

    for (var i = 1; i <= 12; i++) {
        if (grgSumOfDays[grgLeap ? 1 : 0][i] >= grgElapsed) {
            grgMonth = i;
            grgDay = grgElapsed - grgSumOfDays[grgLeap ? 1 : 0][i - 1];
            break;
        }
    }

    return new Date(grgYear, grgMonth, grgDay, 0, 0, 0);
}

function grgIsLeap(Year) {
    return ((Year % 4) == 0 && ((Year % 100) != 0 || (Year % 400) == 0));
}

function hshIsLeap(Year) {
    Year = (Year - 474) % 128;
    Year = ((Year >= 30) ? 0 : 29) + Year;
    Year = Year - Math.floor(Year / 33) - 1;
    return ((Year % 4) == 0);
}

function hshDayOfWeek(hshYear, hshMonth, hshDay) {
    var value;
    value = hshYear - 1376 + hshSumOfDays[0][hshMonth - 1] + hshDay - 1;

    for (var i = 1380; i < hshYear; i++)
        if (hshIsLeap(i)) value++;
    for (var i = hshYear; i < 1380; i++)
        if (hshIsLeap(i)) value--;

    value = value % 7;
    if (value < 0) value = value + 7;

    return (value);
}

function hshDayName(DayOfWeek) {
    return calNames("df", DayOfWeek % 7);
}

function calNames(calendarName, monthNo) {
    switch (calendarName) {
        case "hf": return Array("فروردين", "ارديبهشت", "خرداد", "تير", "مرداد", "شهريور", "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند")[monthNo];
        case "ge": return Array(" January ", " February ", " March ", " April ", " May ", " June ", " July ", " August ", " September ", " October ", " November ", " December ")[monthNo];
        case "gf": return Array("ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوثن", "ژوییه", "اوت", "سپتامبر", "اكتبر", "نوامبر", "دسامبر")[monthNo];
        case "df": return Array("شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه")[monthNo];
        case "de": return Array("Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday")[monthNo];
    }
}