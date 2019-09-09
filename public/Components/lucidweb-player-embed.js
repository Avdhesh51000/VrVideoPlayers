(function(){
	"use strict";

	var LucidwebEmbed = function(){
		this.mainScript = "https://aframe.io/releases/0.7.0/aframe.js";
		var path = (location.origin.indexOf("localhost") !== -1 ? "http://localhost:3000/" : "https://lucidweb.io/communityplayer/");
		if (location.origin.indexOf("momu.be") > 0) {
			path = "https://lucidweb.io/coreplayer/";
			//console.log(src);
		}
		this.secondaryScripts = [
			path + "/assets/lucidweb-device-handler-component.js",
			path + "/assets/lucidweb-player-component.js",
			path + "/assets/lucidweb-ui-component.js",
			path + "/assets/lucidweb-player-analytics.js"
		];
		this.htmlFiles = [
			path + "/assets/lucidweb-player-ui.html",
			path + "/assets/lucidweb-player-ascene.html"
		];
		this.styleSheet = path + "/assets/style.css";

		window.addEventListener("load", this.onWindowLoaded.bind(this));
	}

	LucidwebEmbed.prototype.onWindowLoaded = function(){
		var lucidwebPlayerDiv = document.querySelector("#lucidweb-player");
		if(lucidwebPlayerDiv){
			this.init({
				src : lucidwebPlayerDiv.getAttribute("src")
			})
		}
	}

	LucidwebEmbed.prototype.init = function(params){
		var that = this;

		this.loadScripts().then(function(){
			document.querySelector("a-scene").setAttribute("embedded", true);
			AFRAME.scenes[0].resize();
                        if ( params.src == "https://lucidweb.io/testing/OLITH_mid_2k.mp4" ) {
                                if (! AFRAME.utils.device.isMobile() ) { params.src = "https://lucidweb.io/testing/OLITH_mid_2k_hbt.mp4" ; }
                                if (/SamsungBrowser/.test(navigator.userAgent)) { params.src = "https://lucidweb.io/testing/OLITH_mid_1k_hbt.mp4" ; }
                                if (/iPad/.test(navigator.userAgent)) { params.src = "https://lucidweb.io/testing/OLITH_mid_1k_hbt.mp4" ; }
				/*
                                if (/iPhone/.test(navigator.userAgent)) {
                                        document.querySelector("#tapToUnmute").addEventListener("click", function(){
						var lwp = document.querySelector("#lucidweb-player").style;
                                                lwp.position = "fixed";
                                                lwp.width = "100vw";
                                                lwp.height = "100vh";
                                                document.querySelector("#pageHeader").style.display = "none";
                                                document.querySelector("#welcome").style.display = "none";
                                        })
                                }
				*/
				function mobileExtend(URL){
					window.open(URL, '_blank');
				}
				if (AFRAME.utils.device.isMobile() ){
					var playerURL = "https://lucidweb.io/coreplayer/?src=";
					var lucidwebPlayerDiv = document.querySelector("#lucidweb-player");
					lucidwebPlayerDiv.addEventListener("click", mobileExtend(playerURL + params.src) );
				}
			}
			document.querySelector("[lucidweb-player]").setAttribute("lucidweb-player", { src : params.src});
			ga('send', 'event', 'videoPlayed', params.src);
			ga('send', 'event', 'domain', location.href);
			that.registerExtraUI();
		}).catch((err) => {
		  console.log("Error in loading lucidweb-player scripts", err);
		});
	}

	LucidwebEmbed.prototype.registerExtraUI = function(){
		var buttonEnterVR = document.querySelector("#lucidweb-player-start");
		if(buttonEnterVR){
			buttonEnterVR.addEventListener("click", player.enterVR);
		}
	}

	LucidwebEmbed.prototype.loadScripts = function(){
		var that = this;
		var promises = [];
		var parentElt = document.querySelector("#lucidweb-player");

		function appendScript(params){
			return new Promise((resolve, reject) => {
				const script = document.createElement('script');
				params.parentElt.appendChild(script);
				script.onload = resolve;
				script.onerror = reject;
				script.src = params.src;
			});
		}

		function appendHTML(params){
			return new Promise((resolve, reject) => {
				return fetch(params.src).then(function(response){
					return response.text();
				}).then(function(htmldata){
					var elt = document.createElement('div');
					elt.innerHTML = htmldata;

			    var template = elt.querySelector('template');
			    var clone = document.importNode(template.content, true);
			    params.parentElt.appendChild(clone);
					resolve();
				}).catch(reason => {
				  console.log("Error in loading lucidweb-player HTML", reason);
					reject();
				});
			})
		}

		function appendCSS(params){
			return new Promise((resolve, reject) => {
		    const link  = document.createElement('link');
		    link.rel  = 'stylesheet';
		    link.type = 'text/css';
		    link.href = params.src;
		    link.media = 'all';
		    params.parentElt.appendChild(link);
				resolve();
			});
		}

		return new Promise((resolve, reject) => {
			//We cannot use async/await because of Samsung VR as of the 27.11.2017
			//So we have to use callback
			appendScript({
				parentElt : document.head,
				src 			: that.mainScript
			}).then(() => {
				appendCSS({
					parentElt : document.head,
					src 			: that.styleSheet
				}).then(() => {
					appendScript({
						parentElt : parentElt,
						src 			: that.secondaryScripts[0]
					}).then(() => {
						appendScript({
							parentElt : parentElt,
							src 			: that.secondaryScripts[1]
						}).then(() => {
							appendScript({
								parentElt : parentElt,
								src 			: that.secondaryScripts[2]
							}).then(() => {
								appendScript({
									parentElt : parentElt,
									src 			: that.secondaryScripts[3]
								}).then(() => {
									appendHTML({
										parentElt : parentElt,
										src 			: that.htmlFiles[0]
									}).then(() => {
										appendHTML({
											parentElt : parentElt,
											src 			: that.htmlFiles[1]
										}).then(() => {
											resolve();
										}).catch((err) => {
											reject(err);
										});
									});
								});
							});
						});
					});
				});
			});
			return true;
		});
	}

	new LucidwebEmbed();
})();