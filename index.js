const Crawler = require('crawler');
const request = require('request');

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            // $ is Cheerio by default
            //a lean implementation of core jQuery designed specifically for the server
            console.log($("title").text());
            var path = {
                absolute : [],
                relative : [],
                other : [],
                domain : {}
            }
            $("a").each( (index, value) => {
                var link = $(value).attr('href');
                if(link.indexOf("http")==0) {
                    if(link.indexOf("https://")==0) {
                        var base = link.substring("https://".length,link.length)
                        var p = base.indexOf("/");
                        var domain = null;
                        var dpath = "/";
                        if( p !=-1 ) {
                            domain = base.substring(0,p);
                            dpath = base.substring(p+1,base.length);
                            console.log("-->",base.substring(0,p));
                        } else {
                            domain = base;
                            console.log("-->",base)
                        }
                        if(!(domain in path.domain)) {
                            path.domain[domain] = [];
                        }
                        if(dpath.substring(0,1)!='/')
                            dpath = '/' + dpath;
                        path.domain[domain].push(dpath);
                    } else if(link.indexOf("http://")==0) {
                        var base = link.substring("http://".length,link.length)
                        var p = base.indexOf("/");
                        var domain = null;
                        var dpath = "/";
                        if( p !=-1 ) {
                            domain = base.substring(0,p);
                            dpath = base.substring(p+1,base.length);
                            console.log("-->",base.substring(0,p));
                        } else {
                            domain = base;
                            console.log("-->",base)
                        }
                        if(!(domain in path.domain)) {
                            path.domain[domain] = [];
                        }
                        if(dpath.substring(0,1)!='/')
                            dpath = '/' + dpath;
                        path.domain[domain].push(dpath);
                    }
                    path.absolute.push(link);
                } else if(link.indexOf("/") == 0) {
                    path.relative.push(link);
                } else {
                    path.other.push(link);
                }
            });
            path.absolute.sort();
            path.relative.sort();
            path.other.sort();
            console.log( "absolute",path.absolute );
            console.log( "relative",path.relative );
            console.log( "other",path.other );
            console.log("domain",path.domain);
            
        }
        done();
    }
});

// Queue just one URL, with default callback
c.queue('https://www.catho.com.br');