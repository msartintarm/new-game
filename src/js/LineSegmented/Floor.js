import LineSegmented from './LineSegmented';


let floorFrame = [
	[1,168,610,169,610,184,2,181,1,168],
	[3,794,2,769,779,764,782,785,3,794],
	[1596,1560,2,756],

	[257,6,728,26,742,351,727,366,347,361,
		346,378,773,389,762,22,1584,16,1564,
		880,1123,969,935,939,1570,1198,1568,
		1156,1164,998,1588,909,1552,14],

	[1606,1177,2441,546,2435,465,1660,1098,1687,
		44,2264,47,2192,333,1870,339,1894,165,
		1915,168,1912,294,2147,279,2177,119,
		1756,80,1732,933,1813,393,2315,363,
		2387,65,3168,50,3144,657,3159,2834,
		2789,2774,1856,1787],

	[1624,1540,2768,525,2768, // opened up break in hole
		603,2765,279,2822,279,2825,792,
		2978,789,2978,828,2825,846,
		2822,900,2966,930,2969,978,
		2822,1017,2816,1071,2966,1122,
		2969,1195,2567,1189,2603,882,1870,
		1486,2069,1498,2078,1819,2876,1912,
		2912,2150],

	[3105,2086,3102,1489,2411,1483,2405,1453,3180,1432], // and another break


		[108,1710,158,1758,234,1776,392,1796,496,1786,592,1742,576,  // message
		1674,446,1604,316,1610,232,1668,172,1774,162,1878,196,2104,
		242,2198,310,2230,420,2250,526,2224,576,2174,616,2120,672,
		2060,736,2034,792,2034,836,2072,800,2058,754,2028,662,2048,
		626,2126,628,2216,646,2260,724,2280,792,2264,820,2220,836,
		2158,826,2104,790,2056,828,2080,878,2094,928,2058,966,2018,
		978,2046,960,2174,932,2260,928,2278,948,2192,992,2070,1012,
		2028,1040,2012,1072,2056,1070,2118,1058,2184,1050,2222,1048,
		2266,1082,2300,1114,2286,1152,2250,1178,2206,1178,2190,1218,
		2070,1264,2004,1306,1988,1346,1998,1328,2002,1240,2030,1190,
		2130,1184,2238,1238,2326,1250,2322,1296,2266,1360,1992,1364,
		1966,1346,2020,1334,2226,1328,2250,1310,2414,1244,2614,1222,
		2578,1300,2374,1396,2134,1400,2128,1436,2056,1456,2020,1462,
		1994,1464,1988,1226,2570,1244,2604,1296,2486,1326,2356,1256,
		2616,1224,2594,1472,1986,1566,2008,1520,2226,1540,2280,1588,
		2252,1680,2068,1718,2012,1800,2006,1714,2032,1628,2150,1606,
		2238,1620,2310,1714,2254,1774,2140,1824,1994,1866,1836,1866,
		1816,1796,2002,1796,2002,1786,2216,1802,2292,1842,2224,1928,
		1980,1956,1778,1960,1696,1920,1968,1902,2104,1896,2282,1906,
		2294,1980,2292,2032,2204,2052,2106,2052,2060,2052,2062,2092,
		2164,2094,2236,2090,2300,2032,2306,2006,2266,1996,2262,1948,
		2276,1908,2252,1912,2148,1920,2042,1920,1962,1620,1836,1704,
		1872,2142,2054,2410,2088,2422,2086,2118,2046,1880,1942,1874,
		2062,1878,2200,1950,2306,2028,2178,2044,2104,2098,2226,2092,
		2314,2020,2308,310,2364,1996,2412,800,2454,1898,2540,1084,2596,
		1736,2658,1298,2712,1624,2768,1434,2830,1552,2854,1514,2882,
		1532,2894,1542,3198]

];

class Floor {
    constructor(opts) {
    	if (!opts) opts = {};
    	opts.fillColor = true; // evetuaully could be an RGB  value or texture
	    return new LineSegmented(opts, floorFrame);
    }
}

export default Floor
