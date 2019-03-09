# eztfl-html5
I'm at x,y travelling in direction z. What London bus stops will take me where?

The site itself can be visited at https://eztfl-html5.mpsvr.com/b.html
An example of what the site looks like can be seen at https://eztfl-html5.mpsvr.com/final.jpg

Have a look at https://eztfl-html5.mpsvr.com/elite-inspiration.jpg. This cap is a game from my youth, Braben and Bell's
Elite - https://en.wikipedia.org/wiki/Elite_(video_game). The perspective shifted circle at the bottom perfectly describes
in 2 dimensions what's happening in 3 dimensions, something that stayed with me as a games programmer. Following on from
my original bus stop project at https://github.com/Csi18nAlistairMann/eztfl, I wondered: could I use the same technique to
describe bus stops that are around me, and that I'm yet to get to, not just that I'm stood at? If so, I could also 
determine which of several stops I could go to seeing what buses would turn up after the time it took me to get there. And
could I make it update in realtime, just like Elite? This mid 2017 project was the result.

Have a look at The Egg https://eztfl-html5.mpsvr.com/egg.png. This perspective shifts a circle into the format for a smart
phone, with the white dot representing roughly where the center is, some half a mile in front of you. The idea was for the 
red circles of bus stops ("R" and "S" in this photo: https://trueform.co.uk/app/uploads/2013/11/bus-stop-1.jpg) near the 
visitor to appear in the egg, and move left and right as the visitor turns round, and move nearer and farther as the
visitor walks. Around the edges of the display would appear the destinations that could be obtained from the bus stops,
and they too would move as the visitor moves. Originally I had intended that the bus numbers themselves would appear
between the two, but it became more obvious to show them underneath. In addition, I have a accelerometry stats at the top
left, a scale bar (the faster you move, the tighter the bar), manual rotation arrows, and a menu. Clicking on the bus stop
will show the countdown schedule for it. Clicking on a bus number highlights the bus stops it visits. Clicking on the
destination highlights bus stops that have it as a destination.

This project was more demanding than the earlier one - I experimented with html5 and javascript, accelerometry, CORS and
SSL and others. Unsatisfying is that as yet, html5+javascript can't get much better than a very few frames per second
so "update in realtime" isn't quite met. Also there are quite a few things that can go wrong and when one does, the
platform is not usually very transparent about it. Additional work to check for and report those problems would help.
What I really enjoyed was the documentation side of things - thinking through what I was doing and getting it down (have
a look in the docs directory) was ultimately the most valuable part of the project.
