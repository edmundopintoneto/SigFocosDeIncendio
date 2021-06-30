
function specificationStateGrouped(mesini,mesfim)
{   
    var index = 0;
    var vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "description": "Trabalho Final",
        "width": 770,
        "height": 600,
        "layer": [
            {
                "data": {
                     "url": "data/municipio.json",
                     "format": {
                         "type": "topojson",
                         "feature": "Munic"
                     }
                 },
                "transform": [{"filter": {"or": [
                    {"and": [{"field": "properties.uf", "equal": "SP"}, 
                        {"or":  [  // {"field": "properties.name", "equal": "Cunha"},
                                //{"field": "properties.name", "equal": "Bananal"},
                               // {"field": "properties.name", "equal": "Silveiras"},
                                {"field": "properties.name", "equal": "Bananal"}//,
                             //   {"field": "properties.name", "equal": "Areias"},
                            ]}
                    ]},
                     {"and": [{"field": "properties.uf", "equal": "SP"}, 
                         {"or":  [   {"field": "properties.name", "equal": "Cunha"},
                                     {"field": "properties.name", "equal": "Bananal"},
                                     {"field": "properties.name", "equal": "Areias"},
                                     {"field": "properties.name", "equal": "São José do Barreiro"},
                                 ]}
                    ]}
                ]}}],
                "projection": {
                    "type": "mercator"
                },            
                "mark": {
                    "type": "geoshape",
                    "fill": "#ddd",
                    "stroke": "#ccc"
                },
                "encoding": {
                   "color": {"value": "#eee"},
                   "tooltip": [
                     {"field": "properties.name", "type": "nominal", "title": "Name"}
                   ]
                }     
            },
            {
            "data": {
                "url": "data/municipio.json",
                "format": {
                    "type": "topojson",
                    "feature": "Munic"
                }
            },
            "transform": [{"filter": {"field": "properties.uf", "equal": "RJ"}}],
            "projection": {
                "type": "mercator"
            },            
            "mark": {
                "type": "geoshape",
                "fill": "#ddd",
                "stroke": "gray"
            },
            "encoding": {
                "color": {"value": "#eee"},
                "tooltip": [
                  {"field": "properties.name", "type": "nominal", "title": "Município"}
                ]
             }
        },
        {
            "data": {
                "url": "data/UC_RJ_WGS84.geojson",
                "format": {
                    "type": "json",
                    "property": "features"
                }
            },
            "transform": [{"filter": {"field": "properties.nome_uc", "oneOf": $("#ucs").val()}}],
            "mark": {
                "type": "geoshape",
                "fill": "#0e0",
                "fillOpacity": 0.2,
                "stroke": "green"
            },
            "encoding": {
                "index": 0,
                "color": {"value": "#eee"},
                "tooltip": {"field": "properties.nome_uc", "type": "nominal", "title": "UC"}
             } 

        },
        {
            "data": {
                "url": obtemFileFocosGrouped()
            },
            "transform": [
                {"filter": {"field": "AnoMes", "gt": mesini}},
                {"filter": {"field": "AnoMes", "lt": mesfim}}
            ],
            "projection": {
                "type": "mercator"
            },
            "mark": "circle",
            "encoding": {
                "tooltip": [
                    {"field": "Município", "type": "nominal"},
                    {"field": "Bioma", "type": "nominal"},
                    {"field": "Ano", "type": "quantitative"},
                    {"field": "Mês", "type": "quantitative"},
                    {"field": "Focos", "type": "quantitative"},
                    {"field": "Latitude", "type": "quantitative"},
                    {"field": "Longitude", "type": "quantitative"}
                ],
                "longitude": {
                    "field": "Longitude",
                    "type": "quantitative"
                },
                "latitude": {
                    "field": "Latitude",
                    "type": "quantitative"
                },
                "size": {
                    "field": "Focos",
                    "type": "quantitative",
                    "scale": {"domain": [1, 40], "range":[1, 150], "clamp": true}
                },
                "color": {
                    "type": "quantitative",
                    "field": "Focos",
                    "scale": {
                        "domain": [1,40],
                        "scheme": "goldred",
                        "extent": [0,2],
                    }
                }
            },
        }
        ]
    };

    return vlSpec;
}

function specLineChart(municipio,mesini,mesfim) {
    
    console.log (mesini);
    console.log (mesfim);
    
    var vlSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "description": "Serie temporal",
        "width": 350,
        "height": 70,
        "title": municipio,
        "data": {"url": obtemFileFocosGrouped()},
        "transform": [
                        {"filter": {"field": "Município", "equal": municipio}}
                    ],
        "mark": "line",
        "encoding": {
          "x": {
            "field": "AnoMes", 
            "type": "Temporal", 
            "title": "Meses"
          },
          "y": {
            "field": "Focos", 
            "type": "quantitative",
            "title": "Nº de Focos"
          },
          "color": {"value":"red"}
        }
      }  
    
      return vlSpec;
}

function render (mesini,mesfim,divtop,divbottom) {
    
    console.log ($("#ucs").val());
    console.log(mesini + " " + mesfim + " " + mesini.slice(0, 4) + " " + mesini.slice(5,7));

    spec = specificationStateGrouped(mesini,mesfim);

    vegaEmbed(divtop, spec).then(({spec, view}) => {
        view.addEventListener('click', function (event, item) {
            if (item.datum.Município) {
                console.log(item.datum)
                vegaEmbed(divbottom, specLineChart(item.datum.Município,mesini,mesfim));
            }
        })
    });

}

function obtemFileFocosGrouped() {
    const file_path = "data/FireFocosRioDeJaneiro_Jan2010aJun2021.csv";
    return file_path;
}

function btnClick1()
{
    render($('#mes1').val(),$('#mes2').val(),"#vis1","#vis3",);
}

