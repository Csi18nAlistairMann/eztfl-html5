// This is a description of the ring and we'll use it to
// determine the position on the ring and thus on the
// screen will have given a bearing.
//
// The code is in triplets where the first value is the angle,
// and the second two are the X and Y.
//
// The ring exists in a space 1440x2040 in size
// The centre of the ring from which bearings are made is
// at 720x477.
//
const RINGMAP = [
0,720,1,
3.13,746,2,
4.7,759,3,
6.03,770,4,
6.89,777,5,
7.86,785,6,
8.71,792,7,
9.32,797,8,
10.06,803,9,
10.67,808,10,
11.19,813,11,
11.9,818,12,
12.52,823,13,
13.01,827,14,
13.51,831,15,
14.01,835,16,
14.5,839,17,
15,843,18,
15.38,846,19,
15.88,850,20,
16.38,854,21,
16.76,857,22,
17.14,860,23,
17.52,863,24,
18.02,867,25,
18.4,870,26,
18.78,873,27,
19.16,876,28,
19.54,879,29,
19.92,882,30,
20.3,885,31,
20.57,887,32,
20.95,890,33,
21.33,893,34,
21.6,895,35,
21.98,898,36,
22.25,900,37,
22.63,903,38,
22.9,905,39,
23.28,908,40,
23.55,910,41,
23.93,913,42,
24.19,915,43,
24.46,917,44,
24.73,919,45,
25.11,922,46,
25.38,924,47,
25.65,926,48,
25.92,928,49,
26.19,930,50,
26.57,933,51,
26.83,935,52,
27.1,937,53,
27.37,939,54,
27.64,941,55,
27.91,943,56,
28.18,945,57,
28.45,947,58,
28.72,949,59,
28.98,951,60,
29.25,953,61,
29.52,955,62,
29.79,57,63,
29.95,958,64,
30.22,960,65,
30.49,962,66,
30.76,964,67,
31.03,966,68,
31.29,968,69,
31.56,970,70,
31.73,971,70,
31.99,973,72,
32.26,975,73,
32.53,977,74,
32.69,978,75,
32.96,980,76,
33.22,982,77,
33.39,983,78,
33.66,985,79,
33.92,987,80,
34.19,989,81,
34.35,990,82,
34.62,992,83,
34.79,993,84,
35.05,995,85,
35.22,996,86,
35.48,998,87,
35.75,1000,88,
35.91,1001,89,
36.18,1003,90,
36.34,1004,91,
36.61,1006,92,
36.77,1007,93,
37.04,1009,94,
37.2,1010,95,
37.47,1012,96,
37.63,1013,97,
37.9,1015,98,
38.06,1016,99,
38.32,1018,100,
38.49,1019,101,
38.75,1021,102,
38.92,1022,103,
39.18,1024,104,
39.35,1025,105,
39.52,1026,106,
39.78,1028,107,
39.94,1029,108,
40.11,1030,109,
40.37,1032,110,
40.54,1033,111,
40.7,1034,112,
40.96,1036,113,
41.13,1037,114,
41.39,1039,115,
41.55,1040,116,
41.72,1041,117,
41.98,1043,118,
42.15,1044,119,
42.31,1045,120,
42.57,1047,121,
42.74,1048,122,
42.9,1049,123,
43.16,1051,124,
43.33,1052,125,
43.49,1053,126,
43.66,1054,127,
43.91,1056,128,
44.08,1057,129,
44.25,1058,130,
44.41,1059,131,
44.67,1061,132,
44.83,1062,133,
45,1063,134,
45.17,1064,135,
45.33,1065,136,
45.58,1067,137,
45.75,1068,138,
45.92,1069,139,
46.08,1070,140,
46.33,1072,141,
46.5,1073,142,
46.67,1074,143,
46.83,1075,144,
47,1076,145,
47.16,1077,146,
47.41,1079,147,
47.58,1080,148,
47.74,1081,149,
47.91,1082,150,
48.07,1083,151,
48.24,1084,152,
48.41,1085,153,
48.57,1086,154,
48.74,1087,155,
48.98,1089,156,
49.14,1090,157,
49.31,1091,158,
49.47,1092,159,
49.64,1093,160,
49.8,1094,161,
49.97,1095,162,
50.13,1096,163,
50.37,1098,164,
50.54,1099,165,
50.7,1100,166,
50.87,1101,167,
51.03,1102,168,
51.19,1103,169,
51.36,1104,170,
51.52,1105,171,
51.69,1106,172,
51.85,1107,173,
52.01,1108,174,
52.18,1109,175,
52.34,1110,176,
52.5,1111,177,
52.67,1112,178,
52.83,1113,179,
52.99,1114,180,
53.15,1115,181,
53.32,1116,182,
53.48,1117,183,
53.64,1118,184,
53.8,1119,185,
53.96,1120,186,
54.13,1121,187,
54.29,1122,188,
54.45,1123,189,
54.61,1124,190,
54.77,1125,191,
54.93,1126,192,
55.09,1127,193,
55.25,1128,194,
55.41,1129,195,
55.57,1130,196,
55.73,1131,197,
55.89,1132,198,
56.05,1133,199,
56.21,1134,200,
56.37,1135,201,
56.53,1136,202,
56.69,1137,203,
56.85,1138,204,
57.01,1139,205,
57.11,1139,206,
57.26,1140,207,
57.42,1141,208,
57.58,1142,209,
57.74,1143,210,
57.9,1144,211,
58.06,1145,212,
58.21,1146,213,
58.37,1147,214,
58.53,1148,215,
58.68,1149,216,
58.94,1150,218,
59.09,1151,219,
59.25,1152,220,
59.41,1153,221,
59.56,1154,222,
59.72,1155,223,
59.87,1156,224,
59.97,1156,225,
60.13,1157,226,
60.28,1158,227,
60.44,1159,228,
60.59,1160,229,
60.75,1161,230,
60.9,1162,231,
61,1162,232,
61.15,1163,233,
61.31,1164,234,
61.46,1165,235,
61.62,1166,236,
61.71,1166,237,
61.87,1167,238,
62.02,1168,239,
62.17,1169,240,
62.33,1170,241,
62.48,1171,242,
62.58,1171,243,
62.73,1172,244,
62.88,1173,245,
63.03,1174,246,
63.18,1175,247,
63.33,1176,248,
63.43,1176,249,
63.59,1177,250,
63.74,1178,251,
63.89,1179,252,
64.04,1180,253,
64.14,1180,254,
64.29,1181,255,
64.44,1182,256,
64.58,1183,257,
64.73,1184,258,
64.83,1184,259,
64.98,1185,260,
65.13,1186,261,
65.28,1187,262,
65.38,1187,263,
65.53,1188,264,
65.68,1189,265,
65.82,1190,266,
65.97,1191,267,
66.07,1191,268,
66.22,1192,269,
66.36,1193,270,
66.51,1194,271,
66.61,1194,272,
66.76,1195,273,
66.9,1196,274,
67.05,1197,275,
67.15,1197,276,
67.3,1198,277,
67.44,1199,278,
67.54,1199,279,
67.69,1200,280,
67.83,1201,281,
67.97,1202,282,
68.12,1203,283,
68.22,1203,284,
68.36,1204,285,
68.5,1205,286,
68.61,1205,287,
68.75,1206,288,
68.89,1207,289,
68.99,1207,290,
69.14,1208,291,
69.28,1209,292,
69.38,1209,293,
69.52,1210,294,
69.66,1211,295,
69.8,1212,296,
69.94,1213,297,
70.04,1213,298,
70.18,1214,299,
70.32,1215,300,
70.43,1215,301,
70.57,1216,302,
70.7,1217,303,
70.81,1217,304,
70.95,1218,305,
71.08,1219,306,
71.19,1219,307,
71.32,1220,308,
71.46,1221,309,
71.57,1221,310,
71.7,1222,311,
71.84,1223,312,
71.94,1223,313,
72.08,1224,314,
72.21,1225,315,
72.35,1226,316,
72.45,1226,317,
72.59,1227,318,
72.69,1227,319,
72.83,1228,320,
72.96,1229,321,
73.06,1229,322,
73.2,1230,323,
73.33,1231,324,
73.43,1231,325,
73.57,1232,326,
73.7,1233,327,
73.8,1233,328,
73.94,1234,329,
74.07,1235,330,
74.17,1235,331,
74.3,1236,332,
74.44,1237,333,
74.54,1237,334,
74.67,1238,335,
74.77,1238,336,
74.9,1240,337,
75.03,1240,338,
75.16,1241,339,
75.29,1242,340,
75.4,1242,341,
75.53,1243,342,
75.63,1243,343,
75.76,1244,344,
75.89,1245,345,
75.99,1245,346,
76.12,1246,347,
76.25,1247,348,
76.35,1247,349,
76.48,1248,350,
76.58,1248,351,
76.71,1249,352,
76.83,1250,353,
76.93,1250,354,
77.06,1251,355,
77.16,1251,356,
77.29,1252,357,
77.41,1253,358,
77.52,1253,359,
77.64,1254,360,
77.74,1254,361,
77.87,1255,362,
77.99,1256,363,
78.1,1256,364,
78.22,1257,365,
78.32,1257,366,
78.44,1258,367,
78.57,1259,368,
78.67,1259,369,
78.77,1259,370,
78.89,1260,371,
79.02,1261,372,
79.12,1261,373,
79.24,1262,374,
79.34,1262,375,
79.46,1263,376,
79.57,1263,377,
79.69,1264,378,
79.81,1265,379,
79.91,1265,380,
80.03,1266,381,
80.13,1266,382,
80.25,1267,383,
80.35,1267,384,
80.47,1268,385,
80.59,1269,386,
80.69,1269,387,
80.81,1270,388,
80.91,1270,389,
81.03,1271,390,
81.13,1271,391,
81.25,1272,392,
81.35,1272,393,
81.46,1273,394,
81.57,1273,395,
81.68,1274,396,
81.78,1274,397,
81.9,1275,398,
82.01,1276,399,
82.12,1276,400,
82.23,1277,401,
82.45,1278,403,
82.66,1279,405,
82.87,1280,407,
82.99,1281,408,
83.2,1282,410,
83.51,1283,413,
83.73,1284,415,
83.94,1285,417,
84.05,1286,418,
84.26,1287,420,
84.47,1288,422,
84.68,1289,424,
84.89,1290,426,
85.1,1291,428,
85.3,1292,430,
85.51,1293,432,
85.72,1294,434,
85.92,1295,436,
86.23,1296,439,
86.43,1297,441,
86.63,1298,443,
86.84,1299,445,
87.04,1300,447,
87.24,1301,449,
87.34,1302,450,
87.54,1303,452,
87.74,1304,454,
88.04,1305,457,
88.24,1306,459,
88.54,1307,462,
88.73,1308,464,
88.93,1309,466,
89.13,1310,468,
89.32,1311,470,
89.52,1312,472,
89.81,1313,475,
90,1314,477,
90.19,1315,479,
90.48,1316,482,
90.67,1317,484,
90.96,1318,487,
91.15,1319,489,
91.34,1320,491,
91.52,1321,493,
91.71,1322,495,
91.9,1323,497,
92.18,1324,500,
92.56,1325,504,
92.74,1326,506,
93.02,1327,509,
93.2,1328,511,
93.38,1329,513,
93.56,1330,515,
93.75,1331,517,
94.02,1332,519,
94.2,1333,522,
94.56,1334,526,
94.74,1335,528,
95.01,1336,531,
95.19,1337,533,
95.45,1338,536,
95.81,1339,540,
95.98,1340,542,
96.16,1341,544,
96.33,1342,546,
96.5,1343,548,
96.85,1344,552,
97.11,1345,555,
97.28,1346,557,
97.54,1347,560,
97.89,1348,564,
98.05,1349,566,
98.31,1350,569,
98.65,1351,573,
98.81,1352,575,
98.98,1353,577,
99.32,1354,582,
99.48,1355,584,
99.73,1356,586,
100.06,1357,590,
100.3,1358,593,
100.46,1359,595,
100.88,1360,600,
101.03,1361,602,
101.36,1362,606,
101.52,1363,608,
101.84,1364,612,
102.08,1365,615,
102.23,1366,617,
102.55,1367,621,
102.78,1368,624,
103.1,1369,628,
103.41,1370,632,
103.64,1371,635,
104.04,1372,640,
104.18,1373,642,
104.49,1374,646,
104.63,1375,648,
104.94,1376,652,
105.32,1377,657,
105.46,1378,659,
105.84,1379,664,
106.22,1380,669,
106.52,1381,673,
106.73,1382,676,
107.02,1383,680,
107.31,1384,684,
107.68,1385,689,
107.81,1386,691,
108.18,1387,696,
108.46,1388,700,
108.82,1389,705,
109.1,1390,709,
109.45,1391,714,
109.65,1392,717,
110.08,1393,723,
110.43,1394,728,
110.77,1395,733,
111.04,1396,737,
111.38,1397,742,
111.64,1398,746,
111.9,1399,750,
112.24,1400,755,
112.64,1401,761,
113.11,1402,768,
113.36,1403,772,
113.61,1404,776,
114.21,1405,785,
114.66,1406,792,
114.98,1407,797,
115.42,1408,804,
115.73,1409,809,
115.96,1410,813,
116.47,1411,821,
116.9,1412,828,
117.58,1413,839,
118.06,1414,847,
118.48,1415,854,
118.95,1416,862,
119.35,1417,869,
120,1418,880,
120.64,1419,891,
121.38,1420,904,
122.17,1421,918,
122.95,1422,932,
123.82,1423,948,
125.28,1424,975,
129.25,1425,1053,
130.67,1424,1082,
131.32,1423,1095,
131.95,1422,1108,
132.62,1421,1122,
133.4,1420,1140,
134,1419,1152,
134.5,1418,1163,
135.04,1417,1175,
135.37,1416,1182,
135.73,1415,1190,
136.13,1414,1200,
136.49,1413,1207,
136.88,1412,1216,
137.12,1411,1221,
137.46,1410,1229,
137.69,1409,1234,
137.96,1408,1240,
138.19,1407,1245,
138.45,1406,1251,
138.67,1405,1256,
138.93,1404,1262,
139.19,1403,1268,
139.48,1402,1275,
139.77,1401,1282,
139.99,1400,1298,
140.24,1399,1293,
140.48,1298,1299,
140.7,1397,1304,
140.84,1396,1307,
141.05,1395,1312,
141.26,1394,1317,
141.43,1393,1321,
141.64,1392,1326,
141.81,1391,1330,
141.98,1390,1334,
142.18,1389,1339,
142.35,1388,1343,
142.56,1387,1348,
142.69,1386,1341,
142.89,1385,1356,
143.03,1384,1359,
143.25,1383,1365,
143.39,1382,1368,
143.61,1381,1374,
143.75,1380,1377,
143.94,1380,1382,
144.07,1378,1385,
144.2,1377,1388,
144.39,1376,1393,
144.52,1375,1395,
144.62,1374,1398,
144.81,1373,1403,
144.97,1372,1407,
145.09,1371,1410,
145.22,1370,1413,
145.38,1369,1417,
145.5,1368,1420,
145.66,1367,1424,
145.76,1366,1426,
145.91,1365,1430,
146.06,1364,1434,
146.16,1363,1436,
146.28,1362,1439,
146.38,1361,1441,
146.56,1360,1446,
146.73,1359,1451,
146.83,1358,1453,
146.92,1357,1456,
147.04,1356,1458,
147.16,1355,1461,
147.26,1354,1463,
147.43,1353,1468,
147.55,1352,1471,
147.67,1351,1474,
147.76,1350,1476,
147.88,1349,1479,
148.83,1340,1502,
149,1339,1507,
149.13,1338,1511,
150.05,1329,1534,
150.12,1328,1535,
151.71,1311,1575,
151.77,1310,1576,
152.56,1301,1596,
152.62,1300,1597,
153.15,1294,1611,
153.19,1293,1611,
153.72,1286,1625,
154.19,1281,1637,
154.62,1275,1647,
155.01,1270,1657,
155.43,1264,1666,
155.74,1260,1675,
156.08,1255,1683,
156.36,1251,1690,
156.69,1246,1698,
156.94,1242,1703,
157.27,1237,1711,
157.47,1234,1716,
157.71,1230,1722,
158.03,1225,1729,
158.23,1222,1734,
158.47,1218,1739,
159.11,1207,1753,
159.78,1196,1769,
160.12,1190,1777,
160.67,1180,1788,
161.32,1168,1802,
161.69,1161,1810,
162.69,1142,1831,
163.69,1122,1851,
164.71,1101,1871,
164.9,1097,1874,
165.54,1083,1885,
166.05,1072,1894,
166.38,1065,1901,
166.51,1062,1903,
166.73,1057,1906,
166.87,1054,1909,
167.09,1049,1912,
167.26,1045,1915,
167.44,1041,1918,
167.62,1037,1921,
167.83,1032,1924,
168.05,1027,1927,
168.26,1022,1930,
168.43,1018,1933,
168.64,1013,1936,
168.86,1008,1939,
169.07,1003,1942,
169.28,998,1945,
169.46,994,1949,
169.66,989,1952,
169.91,983,1955,
170.12,978,1958,
170.4,971,1961,
170.68,964,1964,
170.89,959,1967,
171.14,953,1971,
171.41,946,1974,
171.73,938,1977,
172.01,931,1980,
172.33,923,1984,
172.6,916,1987,
172.92,908,1990,
173.34,897,1993,
173.65,889,1996,
174.04,879,2000,
174.5,867,2003,
174.95,855,2006,
175.48,841,2009,
176.09,825,2013,
176.8,806,2016,
177.92,776,2019,
180,720,2023,
182.08,664,2019,
183.2,634,2016,
183.91,615,2013,
184.52,599,2009,
185.05,585,2006,
185.5,573,2003,
185.96,561,2000,
186.35,551,1996,
186.66,543,1993,
187.08,532,1990,
187.4,524,1987,
187.67,517,1984,
187.99,509,1980,
188.27,502,1977,
188.59,494,1974,
188.86,487,1971,
189.11,481,1967,
189.32,476,1964,
189.6,469,1961,
189.88,462,1958,
190.09,457,1955,
190.34,451,1952,
190.54,446,1949,
190.72,442,1945,
190.93,437,1942,
191.14,432,1939,
191.36,427,1936,
191.57,422,1933,
191.74,418,1930,
191.95,413,1927,
192.17,408,1924,
192.38,403,1921,
192.56,399,1918,
192.74,395,1915,
192.91,391,1912,
193.13,386,1909,
193.27,383,1906,
193.49,378,1903,
193.62,375,1901,
193.95,368,1894,
194.46,357,1885,
195.1,343,1874,
195.29,339,1871,
196.31,318,1851,
197.31,298,1831,
198.31,279,1810,
198.68,272,1802,
199.33,260,1788,
199.88,250,1777,
200.22,244,1769,
200.89,233,1753,
201.53,222,1739,
201.77,218,1734,
201.97,215,1729,
202.29,210,1722,
202.53,206,1716,
202.73,203,1711,
203.06,198,1703,
203.31,194,1698,
203.64,189,1690,
203.92,185,1683,
204.26,180,1675,
204.57,176,1666,
204.99,170,1657,
205.38,165,1647,
205.81,159,1637,
206.28,154,1625,
206.81,146,1611,
206.85,147,1611,
207.38,140,1597,
207.44,139,1596,
208.23,130,1576,
208.29,129,1575,
209.88,112,1535,
209.95,111,1534,
210.87,102,1511,
211,101,1507,
211.17,100,1502,
212.12,91,1479,
212.24,90,1476,
212.33,89,1474,
212.45,88,1471,
212.57,87,1468,
212.74,86,1463,
212.84,85,1461,
212.96,84,1458,
213.08,83,1456,
213.17,82,1453,
213.27,81,1451,
213.44,80,1446,
213.62,79,1441,
213.72,78,1439,
213.84,77,1436,
213.94,76,1434,
214.09,75,1430,
214.24,74,1426,
214.34,73,1424,
214.5,72,1420,
214.62,71,1417,
214.78,70,1413,
214.91,69,1410,
215.03,68,1407,
215.19,67,1403,
215.38,66,1398,
215.48,65,1395,
215.61,64,1393,
215.8,63,1388,
215.93,62,1385,
216.06,60,1382,
216.25,60,1377,
216.39,59,1374,
216.61,58,1368,
216.75,57,1365,
216.97,56,1359,
217.11,55,1356,
217.31,53,1348,
217.44,52,1343,
217.65,54,1341,
217.82,51,1339,
218.02,50,1334,
218.19,49,1330,
218.36,48,1326,
218.57,47,1321,
218.74,46,1317,
218.95,45,1312,
219.16,44,1307,
219.3,43,1304,
219.52,142,1299,
219.76,40,1298,
220.01,41,1293,
220.23,39,1282,
220.52,38,1275,
220.81,37,1268,
221.07,36,1262,
221.33,35,1256,
221.55,34,1251,
221.81,33,1245,
222.04,32,1240,
222.31,31,1234,
222.54,30,1229,
222.88,29,1221,
223.12,28,1216,
223.51,27,1207,
223.87,26,1200,
224.27,25,1190,
224.63,24,1182,
224.96,23,1175,
225.5,22,1163,
226,21,1152,
226.6,20,1140,
227.38,19,1122,
228.05,18,1108,
228.68,17,1095,
229.33,16,1082,
230.75,15,1053,
234.72,16,975,
236.18,17,948,
237.05,18,932,
237.83,19,918,
238.62,20,904,
239.36,21,891,
240,22,880,
240.65,23,869,
241.05,24,862,
241.52,25,854,
241.94,26,847,
242.42,27,839,
243.1,28,828,
243.53,29,821,
244.04,30,813,
244.27,31,809,
244.58,32,804,
245.02,33,797,
245.34,34,792,
245.79,35,785,
246.39,36,776,
246.64,37,772,
246.89,38,768,
247.36,39,761,
247.76,40,755,
248.1,41,750,
248.36,42,746,
248.62,43,742,
248.96,44,737,
249.23,45,733,
249.57,46,728,
249.92,47,723,
250.35,48,717,
250.55,49,714,
250.9,50,709,
251.18,51,705,
251.54,52,700,
251.82,53,696,
252.19,54,691,
252.32,55,689,
252.69,56,684,
252.98,57,680,
253.27,58,676,
253.48,59,673,
253.78,60,669,
254.16,61,664,
254.54,62,659,
254.68,63,657,
255.06,64,652,
255.37,65,648,
255.51,66,646,
255.82,67,642,
255.96,68,640,
256.36,69,635,
256.59,70,632,
256.9,71,628,
257.22,72,624,
257.45,73,621,
257.77,74,617,
257.92,75,615,
258.16,76,612,
258.48,77,608,
258.64,78,606,
258.97,79,602,
259.12,80,600,
259.54,81,595,
259.7,82,593,
259.94,83,590,
260.27,84,586,
260.52,85,584,
260.68,86,582,
261.02,87,577,
261.19,88,575,
261.35,89,573,
261.69,90,569,
261.95,91,566,
262.11,92,564,
262.46,93,560,
262.72,94,557,
262.89,95,555,
263.15,96,552,
263.5,97,548,
263.67,98,546,
263.84,99,544,
264.02,100,542,
264.19,101,540,
264.55,102,536,
264.81,103,533,
264.99,104,531,
265.26,105,528,
265.44,106,526,
265.8,107,522,
265.98,108,519,
266.25,109,517,
266.44,110,515,
266.62,111,513,
266.8,112,511,
266.98,113,509,
267.26,114,506,
267.44,115,504,
267.82,116,500,
268.1,117,497,
268.29,118,495,
268.48,119,493,
268.66,120,491,
268.85,121,489,
269.04,122,487,
269.33,123,484,
269.52,124,482,
269.81,125,479,
270,126,477,
270.19,127,475,
270.48,128,472,
270.68,129,470,
270.87,130,468,
271.07,131,466,
271.27,132,464,
271.46,133,462,
271.76,134,459,
271.96,135,457,
272.26,136,454,
272.46,137,452,
272.66,138,450,
272.76,139,449,
272.96,140,447,
273.16,141,445,
273.37,142,443,
273.57,143,441,
273.77,144,439,
274.08,145,436,
274.28,146,434,
274.49,147,432,
274.7,148,430,
274.9,149,428,
275.11,150,426,
275.32,151,424,
275.53,152,422,
275.74,153,420,
275.95,154,418,
276.06,155,417,
276.27,156,415,
276.49,157,413,
276.8,158,410,
277.01,159,408,
277.13,160,407,
277.34,161,405,
277.55,162,403,
277.77,163,401,
277.88,164,400,
277.99,164,399,
278.1,165,398,
278.22,166,397,
278.32,166,396,
278.43,167,395,
278.54,167,394,
278.65,168,393,
278.75,168,392,
278.87,169,391,
278.97,169,390,
279.09,170,389,
279.19,170,388,
279.31,171,387,
279.41,171,386,
279.53,172,385,
279.65,173,384,
279.75,173,383,
279.87,174,382,
279.97,174,381,
280.09,175,380,
280.19,175,379,
280.31,176,378,
280.43,177,377,
280.54,177,376,
280.66,178,375,
280.76,178,374,
280.88,179,373,
280.98,179,372,
281.11,180,371,
281.23,181,370,
281.33,181,369,
281.43,181,368,
281.56,182,367,
281.68,183,366,
281.78,183,365,
281.9,184,364,
282.01,184,363,
282.13,185,362,
282.26,186,361,
282.36,186,360,
282.48,187,359,
282.59,187,358,
282.71,188,357,
282.84,189,356,
282.94,189,355,
283.07,190,354,
283.17,190,353,
283.29,191,352,
283.42,192,351,
283.52,192,350,
283.65,193,349,
283.75,193,348,
283.88,194,347,
284.01,195,346,
284.11,195,345,
284.24,196,344,
284.37,197,343,
284.47,197,342,
284.6,198,341,
284.71,198,340,
284.84,199,339,
284.97,200,338,
285.1,200,337,
285.23,202,336,
285.33,202,335,
285.46,203,334,
285.56,203,333,
285.7,204,332,
285.83,205,331,
285.93,205,330,
286.06,206,329,
286.2,207,328,
286.3,207,327,
286.43,208,326,
286.57,209,325,
286.67,209,324,
286.8,210,323,
286.94,211,322,
287.04,211,321,
287.17,212,320,
287.31,213,319,
287.41,213,318,
287.55,214,317,
287.65,214,316,
287.79,215,315,
287.92,216,314,
288.06,217,313,
288.16,217,312,
288.3,218,311,
288.43,219,310,
288.54,219,309,
288.68,220,308,
288.81,221,307,
288.92,221,306,
289.05,222,305,
289.19,223,304,
289.3,223,303,
289.43,224,302,
289.57,225,301,
289.68,225,300,
289.82,226,299,
289.96,227,298,
290.06,227,297,
290.2,228,296,
290.34,229,295,
290.48,230,294,
290.62,231,293,
290.72,231,292,
290.86,232,291,
291.01,233,290,
291.11,233,289,
291.25,234,288,
291.39,235,287,
291.5,235,286,
291.64,236,285,
291.78,237,284,
291.88,237,283,
292.03,238,282,
292.17,239,281,
292.31,240,280,
292.46,241,279,
292.56,241,278,
292.7,242,277,
292.85,243,276,
292.95,243,275,
293.1,244,274,
293.24,245,273,
293.39,246,272,
293.49,246,271,
293.64,247,270,
293.78,248,269,
293.93,249,268,
294.03,249,267,
294.18,250,266,
294.32,251,265,
294.47,252,264,
294.62,253,263,
294.72,253,262,
294.87,254,261,
295.02,255,260,
295.17,256,259,
295.27,256,258,
295.42,257,257,
295.56,258,256,
295.71,259,255,
295.86,260,254,
295.96,260,253,
296.11,261,252,
296.26,262,251,
296.41,263,250,
296.57,264,249,
296.67,264,248,
296.82,265,247,
296.97,266,246,
297.12,267,245,
297.27,268,244,
297.42,269,243,
297.52,269,242,
297.67,270,241,
297.83,271,240,
297.98,272,239,
298.13,273,238,
298.29,274,237,
298.38,274,236,
298.54,275,235,
298.69,276,234,
298.85,277,233,
299,278,232,
299.1,278,231,
299.25,279,230,
299.41,280,229,
299.56,281,228,
299.72,282,227,
299.87,283,226,
300.03,284,225,
300.13,284,224,
300.28,285,223,
300.44,286,222,
300.59,287,221,
300.75,288,220,
300.91,289,219,
301.06,290,218,
301.32,291,216,
301.47,292,215,
301.63,293,214,
301.79,294,213,
301.94,295,212,
302.1,296,211,
302.26,297,210,
302.42,298,209,
302.58,299,208,
302.74,300,207,
302.89,301,206,
302.99,301,205,
303.15,302,204,
303.31,303,203,
303.47,304,202,
303.63,305,201,
303.79,306,200,
303.95,307,199,
304.11,308,198,
304.27,309,197,
304.43,310,196,
304.59,311,195,
304.75,312,194,
304.91,313,193,
305.07,314,192,
305.23,315,191,
305.39,316,190,
305.55,317,189,
305.71,318,188,
305.87,319,187,
306.04,320,186,
306.2,321,185,
306.36,322,184,
306.52,323,183,
306.68,324,182,
306.85,325,181,
307.01,326,180,
307.17,327,179,
307.33,328,178,
307.5,329,177,
307.66,330,176,
307.82,331,175,
307.99,332,174,
308.15,333,173,
308.31,334,172,
308.48,335,171,
308.64,336,170,
308.81,337,169,
308.97,338,168,
309.13,339,167,
309.3,340,166,
309.46,341,165,
309.63,342,164,
309.87,344,163,
310.03,345,162,
310.2,346,161,
310.36,347,160,
310.53,348,159,
310.69,349,158,
310.86,350,157,
311.02,351,156,
311.26,353,155,
311.43,354,154,
311.59,355,153,
311.76,356,152,
311.93,357,151,
312.09,358,150,
312.26,359,149,
312.42,360,148,
312.59,361,147,
312.84,363,146,
313,364,145,
313.17,365,144,
313.33,366,143,
313.5,367,142,
313.67,368,141,
313.92,370,140,
314.08,371,139,
314.25,372,138,
314.42,373,137,
314.67,375,136,
314.83,376,135,
315,377,134,
315.17,378,133,
315.33,379,132,
315.59,381,131,
315.75,382,130,
315.92,383,129,
316.09,384,128,
316.34,386,127,
316.51,387,126,
316.67,388,125,
316.84,389,124,
317.1,391,123,
317.26,392,122,
317.43,393,121,
317.69,395,120,
317.85,396,119,
318.02,397,118,
318.28,399,117,
318.45,400,116,
318.61,401,115,
318.87,403,114,
319.04,404,113,
319.3,406,112,
319.46,407,111,
319.63,408,110,
319.89,410,109,
320.06,411,108,
320.22,412,107,
320.48,414,106,
320.65,415,105,
320.82,416,104,
321.08,418,103,
321.25,419,102,
321.51,421,101,
321.68,422,100,
321.94,424,99,
322.1,425,98,
322.37,427,97,
322.53,428,96,
322.8,430,95,
322.96,431,94,
323.23,433,93,
323.39,434,92,
323.66,436,91,
323.82,437,90,
324.09,439,89,
324.25,440,88,
324.52,442,87,
324.78,444,86,
324.95,445,85,
325.21,447,84,
325.38,448,83,
325.65,450,82,
325.81,451,81,
326.08,453,80,
326.34,455,79,
326.61,457,78,
326.78,458,77,
327.04,460,76,
327.31,462,75,
327.47,463,74,
327.74,465,73,
328.01,467,72,
328.27,470,70,
328.44,469,70,
328.71,472,69,
328.97,474,68,
329.24,476,67,
329.51,478,66,
329.78,480,65,
330.05,482,64,
330.21,1383,63,
330.48,485,62,
330.75,487,61,
331.02,489,60,
331.28,491,59,
331.55,493,58,
331.82,495,57,
332.09,497,56,
332.36,499,55,
332.63,501,54,
332.9,503,53,
333.17,505,52,
333.43,507,51,
333.81,510,50,
334.08,512,49,
334.35,514,48,
334.62,516,47,
334.89,518,46,
335.27,521,45,
335.54,523,44,
335.81,525,43,
336.07,527,42,
336.45,530,41,
336.72,532,40,
337.1,535,39,
337.37,537,38,
337.75,540,37,
338.02,542,36,
338.4,545,35,
338.67,547,34,
339.05,550,33,
339.43,553,32,
339.7,555,31,
340.08,558,30,
340.46,561,29,
340.84,564,28,
341.22,567,27,
341.6,570,26,
341.98,573,25,
342.48,577,24,
342.86,580,23,
343.24,583,22,
343.62,586,21,
344.12,590,20,
344.62,594,19,
345,597,18,
345.5,601,17,
345.99,605,16,
346.49,609,15,
346.99,613,14,
347.48,617,13,
348.1,622,12,
348.81,627,11,
349.33,632,10,
349.94,637,9,
350.68,643,8,
351.29,648,7,
352.14,655,6,
353.11,663,5,
353.97,670,4,
355.3,681,3,
356.87,694,2,
360,720,1
];
