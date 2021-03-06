/*
 conv.js
 Conversion functions

 Copyright (c) 2014, 2015, John Snyders

 ClimbingComp is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 ClimbingComp is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Affero General Public License for more details.

 You should have received a copy of the GNU Affero General Public License
 along with ClimbingComp.  If not, see <http://www.gnu.org/licenses/>.
*/
/* jshint node: true, strict: false */

/*
 * todo
 */

var ErrorValue = {};


function zeroPad2(n) {
    n = n + "";
    if (n.length === 1) {
        n = "0" + n;
    }
    return n;
}

// format is mdy or ymd or dmy
function laxParseDate(value, format) {
    var i, m, date,
        year = null,
        month = null,
        day = null;

    if (!/[mdy]{3}/.test(format)) {
        format = "ymd";
    }

    m = /(\d{1,4})[\/\- ](\d{1,4})[\/\- ](\d{1,4})/.exec(value);
    if (m) {
        for (i = 0; i < format.length; i++) {
            if (format[i] === "y") {
                year = parseInt(m[i + 1], 10);
            } else if (format[i] === "m") {
                month = parseInt(m[i + 1], 10);
            } else if (format[i] === "d") {
                day = parseInt(m[i + 1]);
            }
        }
        if (year !== null && month !== null && day !== null) {
            try {
                date = new Date(year +"-" + zeroPad2(month) + "-" + zeroPad2(day) + "T00:00:00Z");
                if (isNaN(date)) {
                    date = null;
                }
            } catch (ex) {
                date = null;
            }
        }
        return date;
    }
    return null;
}


module.exports = {

    isInvalid: function(value) {
        return value === ErrorValue;
    },

    convertToIntegerId: function(value) {
        var val;
        if (/^\d+$/.test("" + value)) {
            val = parseInt(value, 10);
            if (!isNaN(val)) {
                return val;
            }
        }
        return ErrorValue;
    },

    convertToInteger: function(value) {
        var val;
        if (/^[-+]?\d+$/.test("" + value)) {
            val = parseInt(value, 10);
            if (!isNaN(val)) {
                return val;
            }
        }
        return ErrorValue;
    },

    convertToBool: function(value) {
        value = (value || "").toLowerCase().trim();
        if (value === "true" || value === "yes" || value === "1" || value === "y" || value === "t") {
            return true;
        } else if (value === "false" || value === "no" || value === "0" || value === "n" || value === "f") {
            return false;
        }
        return ErrorValue;
    },

    convertToDate: function(value, format) {
        var date;
        date = laxParseDate(value, format);
        if (date) {
            return date;
        }
        return ErrorValue;
    },

    // genders = "Female,Male"
    convertToGender: function(value) {
        value = value.toLowerCase().trim();
        if (value === "female" || value === "f") {
            return "Female";
        } else if (value === "male" || value === "m" ) {
            return "Male";
        }
        return ErrorValue;
    },

    // todo use values from nvp table
    // categories = "Masters,Open,Adult,Junior,Youth-A,Youth-B,Youth-C,Youth-D"
    convertToCategory: function(value) {
        var map = {
                "master": "Masters",
                "masters": "Masters",
                "open": "Open",
                "adult": "Adult",
                "junior": "Junior",
                "jr": "Junior",
                "youtha": "Youth-A",
                "a": "Youth-A",
                "youthb": "Youth-B",
                "b": "Youth-B",
                "youthc": "Youth-C",
                "c": "Youth-C",
                "youthd": "Youth-D",
                "d": "Youth-D"
            };

        value = value.toLowerCase().trim().replace(/[ -]+/,"");
        value = map[value];
        if (value) {
            return value;
        }
        return ErrorValue;
    },

    // todo use values from nvp table
    convertToRegion: function(value) {
        var match, r, matchCount,
            regions = [
                "101washingtonalaska",
                "102northwest",
                "103northerncalifornia",
                "201southerncalifornia",
                "202southernmountain",
                "203colorado",
                "301midwest",
                "302ohiorivervalley",
                "303midatlantic",
                "401heartland",
                "402bayou",
                "403deepsouth",
                "501capital",
                "502newenglandwest",
                "503newenglandeast"
            ],
            map = {
                "101": "101 (Washington / Alaska)",
                "102": "102 (Northwest)",
                "103": "103 (Northern California)",
                "201": "201 (Southern California)",
                "202": "202 (Southern Mountain)",
                "203": "203 (Colorado)",
                "301": "301 (Midwest)",
                "302": "302 (Ohio River Valley)",
                "303": "303 (Mid-Atlantic)",
                "401": "401 (Heartland)",
                "402": "402 (Bayou)",
                "403": "403 (Deep South)",
                "501": "501 (Capital)",
                "502": "502 (New England West)",
                "503": "503 (New England East)"
            },
            num = parseInt(value, 10);

        if (!isNaN(num) && map[num]) {
            return map[num];
        } else {
            // try to match by string
            matchCount = 0;
            match = value.toLowerCase().replace(/[() \/]/, "");
            regions.forEach(function(r) {
                if (r.indexOf(match) >= 0) {
                    value = map[parseInt(r, 10)];
                    matchCount += 1;
                }
            });
            if (matchCount !== 1) {
                return ErrorValue;
            }
        }
        return value;
    },

    toDbBool: function (value) {
        return value ? 1 : 0;
    },

    fromDbBool: function(value) {
        return value !== 0;
    }
};
