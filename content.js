/// <reference path="typings/jquery/jquery.d.ts"/>

var regions = ["US-Fremont", "US-Atlanta", "BR-Brazil", "EU-London", "RU-Russia", "JP-Tokyo", "CN-China", "SG-Singapore"];
var serverIPs = [];
var retryCount = 50;
$("body").ready(function ()
{
	createList();
	for(var i = 0; i < regions.length; i++)
	{
		for(var j = 0; j < retryCount; j++)
		{
			//grab ips
			$.ajax({
				type: "POST",
				url: "http://m.agar.io/",
				data: regions[i],
				tempJ: j,
				tempI: i,
				success: function(data)
				{
					if($.inArray(data.split("\n")[0], serverIPs) == -1)
					{
						serverIPs.push(data.split("\n")[0]);
					}
					
					if(this.tempJ == retryCount - 1 && this.tempI == regions.length - 1)
					{
						fillList();
						addMoreUI();
					}
				},
				error: function(data)
				{
					if(this.tempJ == retryCount - 1 && this.tempI == regions.length - 1)
					{
						fillList();
						addMoreUI();
					}
				}
			});
		}
	}
});

function addServer(list, toClone, server)
{
	var item = toClone.cloneNode();
	item.textContent = server;
	$(item).attr("value", server);
	list.append(item);
}

function createList()
{
	var serverListElement = $("#region").clone();
	var listItemTitle = serverListElement.children()[0].cloneNode(true);
	listItemTitle.textContent = "-- Loading Server List --";
	
	//change id
	serverListElement.attr("id", "server");
	//clear clones elements
	serverListElement.empty();
	//change functionality
	serverListElement.attr("onchange", "connect($('#server').val()); $('.needs-ip').removeAttr('disabled');");
	
	
	serverListElement.append(listItemTitle);
	
	$("#region").parent().append("</br>");
	$("#region").parent().append(serverListElement);
}
function fillList()
{
	var serverListElement = $("#server");
	var listItem = $("#region").children()[1].cloneNode(true);
	
	$(serverListElement.children()[0]).text("-- Select Server --");
	//Fill in title and options
	for(var i = 0; i < serverIPs.length; i++)
		addServer(serverListElement, listItem, "ws://" + serverIPs[i]);
}

function addMoreUI()
{
	//create a retry button for IP connecting
	var uiDiv = $("#playBtn").parent();
	var retryButton = uiDiv.find("#playBtn").next().clone(false);
	retryButton.attr("id", "retryBtn").text("Find New Session");
	
	retryButton.attr("onclick", "connect($('#server').val());");
	retryButton.attr("disabled", "");
	retryButton.attr("class", "btn btn-play btn-primary needs-ip");
	$("#playBtn").parent().append("</br>");
	$("#playBtn").parent().append(retryButton);
	$("#playBtn").parent().append("</br>");
	$("#playBtn").parent().append("</br>");
}