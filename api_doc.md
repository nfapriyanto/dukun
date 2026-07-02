# Table yang berisi tab/navbar:

## 1. Overview isinya:{data.d.name}
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "close",
        "type",
        "typespecs",
        "pricescale",
        "minmov",
        "fractional",
        "minmove2",
        "currency",
        "change",
        "volume",
        "relative_volume_10d_calc",
        "market_cap_basic",
        "fundamental_currency_code",
        "price_earnings_ttm",
        "earnings_per_share_diluted_ttm",
        "earnings_per_share_diluted_yoy_growth_ttm",
        "dividends_yield_current",
        "sector.tr",
        "market",
        "sector",
        "AnalystRating",
        "AnalystRating.tr"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                5800, // this is Price Header Table
                "stock",
                [
                    "common"
                ],
                1,
                25,
                "false",
                0,
                "IDR",
                3.571428571428571, // this is Chg % Header Table
                132023000, // this is Vol Header Table
                0.6006397974194732, // this is Rel Vol Header Table
                684176510156250, // this is Mkt cap Header Table
                "IDR",
                12.298886696294261, // this is P/E Header Table
                471.5874, // this is EPS dil TTM Header Table
                3.621920181303652, // this is EPS dil growth TTM YoY Header Table
                6.41441441441441, // this is Div yield % TTM Header Table
                "Finance", // this is Sector Header Table
                "indonesia",
                "Finance",
                "StrongBuy",
                "Strong buy" // this is Analyst rating Header Table
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 12 Header Table
| Symbol | Price | Chg % | Vol | Rel Vol | Mkt cap | P/E | EPS dil TTM | EPS dil growth TTM YoY | Div yield % TTM | Sector | Analyst rating |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | 
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | 5800 IDR | +3.57% | 132.02M | 0.60 | 684.18T IDR | 12.30 | 471.59 IDR | +3.62% | 6.41% | Finance | Strong buy |  

## 2. Performance isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "close",
        "type",
        "typespecs",
        "pricescale",
        "minmov",
        "fractional",
        "minmove2",
        "currency",
        "change",
        "Perf.W",
        "Perf.1M",
        "Perf.3M",
        "Perf.6M",
        "Perf.YTD",
        "Perf.Y",
        "Perf.5Y",
        "Perf.10Y",
        "Perf.All",
        "Volatility.W",
        "Volatility.M"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                5800, // this is Price Header Table
                "stock",
                [
                    "common"
                ],
                1,
                25,
                "false",
                0,
                "IDR",
                3.571428571428571, // this is Chg % Header Table
                -1.694915254237288, // this is Perf % 1W Header Table
                0.8695652173913043, // this is Perf % 1M Header Table
                -11.450381679389313, // this is Perf % 3M Header Table
                -28.173374613003094, // this is Perf % 6M Header Table
                -28.173374613003094, // this is Perf % YTD Header Table
                -32.36151603498542, // this is Perf % 1Y Header Table
                -4.448105436573312, // this is Perf % 5Y Header Table
                113.23529411764706, // this is Perf % 10Y Header Table
                16471.428571428572, // this is Perf % All Time Header Table
                4.026795953998013, // this is Volatility % 1W Header Table
                5.654631458237973 // this is Volatility % 1M Header Table
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 14 Header Table
| Symbol | Price | Chg % | Perf % 1W | Perf % 1M | Perf % 3M | Perf % 6M | Perf % YTD | Perf % 1Y | Perf % 5Y | Perf % 10Y | Perf % All Time | Volatility % 1W | Volatility % 1M |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | 5800 IDR | +3.57% | -1.69% | 0.87% | -11.45% | -28.17% | -28.17% | -32.36% | -4.45% | 113.24% | 16471.43% | 4.03% | 5.65% |

## 3. Technicals isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "TechRating_1D",
        "TechRating_1D.tr",
        "MARating_1D",
        "MARating_1D.tr",
        "OsRating_1D",
        "OsRating_1D.tr",
        "RSI",
        "Mom",
        "pricescale",
        "minmov",
        "fractional",
        "minmove2",
        "AO",
        "CCI20",
        "Stoch.K",
        "Stoch.D",
        "candlestick_patterns_1D"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                "Sell",
                "Sell", // this is Tech Rating Header Table
                "StrongSell",
                "Strong sell", // this is MA Rating Header Table
                "Neutral",
                "Neutral", // this is OS Rating Header Table
                47.55901871218532, // this is RSI, 14 Header Table
                -275, // this is Mom, 10 Header Table
                1,
                25,
                "false",
                0,
                -49.19117647058829, // this is AO Header Table
                -10.262248681639202, // this is CCI, 20 Header Table
                19.090909090909083, // this is Stoch, 14,3,3 %K Header Table
                35.876393997781264, // this is Stoch, 14,3,3 %D Header Table
                [
                    "long_upper_shadow_bearish" // this is Pattern Header Table
                ]
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 11 Header Table
| Symbol | Tech Rating | MA Rating | OS Rating | RSI, 14 | Mom, 10 | AO | CCI, 20 | Stoch, 14,3,3 %K | Stoch, 14,3,3 %D | Pattern |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | Sell | Strong sell | Neutral | 47.56 | -275 | -50 | -10.26 | 19.09 | 35.88 | https://s3-symbol-logo.tradingview.com/candlepattern/{candle_pattern}.svg |

## 4. Extended hours isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "premarket_close",
        "type",
        "typespecs",
        "pricescale",
        "minmov",
        "fractional",
        "minmove2",
        "currency",
        "premarket_change",
        "premarket_gap",
        "premarket_volume",
        "close",
        "change",
        "gap",
        "volume",
        "volume_change",
        "postmarket_close",
        "postmarket_change",
        "postmarket_volume"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                5650, // this is Pre-mkt price Header Table
                "stock",
                [
                    "common"
                ],
                1,
                25,
                "false",
                0,
                "IDR",
                0.8928571428571428, // this is Pre-mkt chg % Header Table
                0.8928571428571428, // this is Pre-mkt gap % Header Table
                6690500, // this is Pre-mkt vol Header Table
                5800, // this is Price Header Table
                3.571428571428571, // this is Chg % Header Table
                0.8928571428571428, // this is Gap % Header Table
                145119400, // this is Vol Header Table
                16.91504771848751, // this is Vol chg % Header Table
                null, // this is Post-mkt price Header Table
                null, // this is Post-mkt chg % Header Table
                null // this is Post-mkt vol Header Table
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 13 Header Table
| Symbol | Pre-mkt price | Pre-mkt chg % | Pre-mkt gap % | Pre-mkt vol | Price | Chg % | Gap % | Vol | Vol chg % | Post-mkt price | Post-mkt chg % | Post-mkt vol |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | 5650 IDR | +0.89% | +0.89% | 6.69M | 5800 IDR | +3.57% | 0.89% | 145.12M | +16.92% | - | - | - |

## 5. Forecast isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "market_cap_basic",
        "type",
        "typespecs",
        "fundamental_currency_code",
        "close",
        "pricescale",
        "minmov",
        "fractional",
        "minmove2",
        "currency",
        "earnings_per_share_forecast_next_fy",
        "revenue_forecast_next_fy",
        "net_income_estimate_ntm",
        "free_cash_flow_estimate_ntm",
        "price_earnings_fwd",
        "enterprise_value_ebitda_fwd",
        "price_sales_fwd",
        "total_debt_estimate_fy",
        "book_value_per_share_estimate_fy",
        "dps_estimate_ntm"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                684176510156250, // this is Mkt cap Header Table
                "stock",
                [
                    "common"
                ],
                "IDR",
                5800, // this is Price Header Table
                1,
                25,
                "false",
                0,
                "IDR",
                488.772623, // this is EPS estimate FY Header Table
                117769746828118, // this is Revenue estimate FY Header Table
                null, // this is Net income estimate NTM Header Table
                null, // this is FCF estimate NTM Header Table
                11.616753682160411, // this is P/E forward Header
                null, // this is EV/EBITDA forward Header
                5.752163917887102, // this is P/S forward Header
                7889671537500, // this is Total debt estimate FY Header Table
                2462.435662, // this is Book value per share estimate FY Header Table
                null // this is Dividends per share estimate NTM Header Table
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 13 Header Table
| Symbol | Mkt cap | Price | EPS estimate FY | Revenue estimate FY | Net income estimate NTM | FCF estimate NTM | P/E forward | EV/EBITDA forward | P/S forward | Total debt estimate FY | Book value per share estimate FY | Dividends per share estimate NTM |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | 684.18T IDR | 5800 IDR | 488.77 IDR | 117.77B IDR | - | - | 11.61 | - | 5.75 | 7.89T IDR | 2462.44 IDR | - |

## 6. Valuation isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "market_cap_basic",
        "type",
        "typespecs",
        "fundamental_currency_code",
        "Perf.1Y.MarketCap",
        "price_earnings_ttm",
        "price_earnings_growth_ttm",
        "price_sales_current",
        "price_book_fq",
        "price_to_cash_f_operating_activities_ttm",
        "price_free_cash_flow_ttm",
        "price_to_cash_ratio",
        "enterprise_value_current",
        "enterprise_value_to_revenue_ttm",
        "enterprise_value_to_ebit_ttm",
        "enterprise_value_ebitda_ttm"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                684176510156250, // this is Mkt cap Header Table
                "stock",
                [
                    "common"
                ],
                "IDR",
                -35.44668587896253, // this is Mkt cap perf % Header Table
                12.298886696294261, // this is P/E % Header Table
                3.2785888591196395, // this is PEG TTM Header Table
                6.025860142700439, // this is P/S Header Table
                2.75918901041277, // this is P/B Header Table
                11.55780883062059, // this is P/CF Header Table
                12.036563433664133, // this is P/FCF Header Table
                null, // this is Price/cash Header Table
                608958001156250, // this is EV Header Table
                4.764639756234625, // this is EV/revenue TTM Header Table
                null, // this is EV/EBIT TTM Header Table
                null // this is EV/EBITDA TTM Header Table
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 14 Header Table
| Symbol | Mkt cap | Mkt cap perf % | P/E % | PEG TTM | P/S | P/B | P/CF | P/FCF | Price/cash | EV | EV/revenue TTM | EV/EBIT TTM | EV/EBITDA TTM |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | 684.18T IDR | -35.45% | 12.30 | 3.28 | 6.03 | 2.76 | 11.56 | 12.04 | - | 608.96T IDR | 4.76 | - | - |

## 7. Dividends isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "dps_common_stock_prim_issue_fy",
        "type",
        "typespecs",
        "fundamental_currency_code",
        "dps_common_stock_prim_issue_fq",
        "dividends_yield_current",
        "dividends_yield",
        "dividend_payout_ratio_ttm",
        "dps_common_stock_prim_issue_yoy_growth_fy",
        "continuous_dividend_payout",
        "continuous_dividend_growth"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                336, // this is Div per share FY Header Table
                "stock",
                [
                    "common"
                ],
                "IDR",
                20, // this is Div per share FQ Header Table
                6.41441441441441, // this is Div yield % TTM Header Table
                0, // this is Div yield % (indicated) Header Table
                75.48971834277167, // this is Div payout ratio % TTM Header Table
                12, // this is DPS growth % Annual YoY Header Table
                25, // this is Cont div payout Header Table
                5 // this is Cont div growth Header Table
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 9 Header Table
| Symbol | Div per share FY | Div per share FQ | Div yield % TTM | Div yield % (indicated) | Div payout ratio % TTM | DPS growth % Annual YoY | Cont div payout | Cont div growth |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | 336 IDR | 20 IDR | 6.41% | 0% | 75.49% | +12% | 25 | 5 |

## 8. Profitability isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "gross_margin_ttm",
        "operating_margin_ttm",
        "pre_tax_margin_ttm",
        "net_margin_ttm",
        "free_cash_flow_margin_ttm",
        "return_on_assets_fq",
        "return_on_equity_fq",
        "return_on_invested_capital_fq",
        "research_and_dev_ratio_ttm",
        "sell_gen_admin_exp_other_ratio_ttm"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                null, // this is Gross margin TTM Header Table
                62.95715797322179, // this is Operating margin TTM Header Table
                56.242498989146, // this is Pre-tax margin TTM Header Table
                50.850615732109375, // this is Net margin TTM Header Table
                46.33341630689852, // this is Free cash flow margin TTM Header Table
                3.65875313811899, // this is Return on assets TTM Header Table
                22.9792955760953, // this is Return on equity TTM Header Table
                22.8919134752423, // this is Return on invested capital TTM Header Table
                null, // this is Research and dev ratio TTM Header Table
                null // this is Sell gen admin exp other ratio TTM Header Table
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 11 Header Table
| Symbol | Gross margin TTM | Operating margin TTM | Pre-tax margin TTM | Net margin TTM | Free cash flow margin TTM | Return on assets TTM | Return on equity TTM | Return on invested capital TTM | Research and dev ratio TTM | Sell gen admin exp other ratio TTM |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | - | 62.96% | 56.24% | 50.85% | 46.33% | 3.66% | 22.98% | 22.89% | - | - |

## 9. Income statement isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "fiscal_period_current",
        "fiscal_period_end_current",
        "total_revenue_ttm",
        "type",
        "typespecs",
        "fundamental_currency_code",
        "total_revenue_yoy_growth_ttm",
        "gross_profit_ttm",
        "oper_income_ttm",
        "net_income_ttm",
        "ebitda_ttm",
        "earnings_per_share_diluted_ttm",
        "earnings_per_share_diluted_yoy_growth_ttm"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                "2026-Q1", // this is Fiscal priod Current Header Table
                1774915200, // this is Fiscal priod end Current Header Table
                127807774000000, // this is Revenue TTM Header Table
                "stock",
                [
                    "common"
                ],
                "IDR",
                4.446348099892851, // this is Revenue growth TTM YoY Header Table
                null, // this is Gross profit TTM Header Table
                71901873000000, // this is Op income TTM Header Table
                58075279000000, // this is Net income TTM Header Table
                null, // this is EBITDA TTM Header Table
                471.5874, // this is EPS dil TTM Header Table
                3.621920181303652 // this is EPS dil growth TTM YoY Header Table
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 11 Header Table
| Symbol | Fiscal priod Current | Fiscal priod end Current | Revenue TTM | Revenue growth TTM YoY | Gross profit TTM | Op income TTM | Net income TTM | EBITDA TTM | EPS dil TTM | EPS dil growth TTM YoY |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | 2026-Q1 | 2026-03-31 | 127.81T IDR | +4.45% | - | 71.9T IDR | 58.07T IDR | - | 471.59 IDR | +3.62% |

## 10. Balance sheet isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "fiscal_period_current",
        "fiscal_period_end_current",
        "total_assets_fq",
        "type",
        "typespecs",
        "fundamental_currency_code",
        "total_current_assets_fq",
        "cash_n_short_term_invest_fq",
        "total_liabilities_fq",
        "total_debt_fq",
        "net_debt_fq",
        "total_equity_fq",
        "current_ratio_fq",
        "quick_ratio_fq",
        "debt_to_equity_fq",
        "cash_n_short_term_invest_to_total_debt_fq"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                "2026-Q1", // this is Fiscal period Current Header Table
                1774915200, // this is Fiscal period end date Current Header Table
                1640830566000000, // this is Total assets FQ Header Table
                "stock",
                [
                    "common"
                ],
                "IDR",
                174053014000000, // this is Current assets FQ Header Table
                null, // this is Cash on hand FQ Header Table
                1381471773000000, // this is Total liabilities FQ Header Table
                6811249000000, // this is Total debt FQ Header Table
                -75444895000000, // this is Net debt FQ Header Table
                259358793000000, // this is Total equity FQ Header Table
                0.158545491013391, // this is Current ratio FQ Header Table
                null, // this is Quick ratio FQ Header Table
                0.02628482125742, // this is Debt/equity FQ Header Table
                null // this is Cash/debt FQ Header Table
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 14 Header Table
| Symbol | Fiscal period Current | Fiscal period end date Current | Total assets FQ | Current assets FQ | Cash on hand FQ | Total liabilities FQ | Total debt FQ | Net debt FQ | Total equity FQ | Current ratio FQ | Quick ratio FQ | Debt/equity FQ | Cash/debt FQ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | 2026-Q1 | 2026-03-31 | 1640.83T IDR | 174.05T IDR | - | 1381.47T IDR | 68.1T IDR | -75.44T IDR | 259.35T IDR | 0.16 | - | 0.03 | - |

## 11. Cash flow isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "fiscal_period_current",
        "fiscal_period_end_current",
        "cash_f_operating_activities_ttm",
        "type",
        "typespecs",
        "fundamental_currency_code",
        "cash_f_investing_activities_ttm",
        "cash_f_financing_activities_ttm",
        "free_cash_flow_ttm",
        "neg_capital_expenditures_ttm"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                "2026-Q1", // this is Fiscal period Current Header Table
                1774915200, // this is Fiscal period end Current Header Table
                61670660000000, // this is Operating CF TTM Header Table
                "stock",
                [
                    "common"
                ],
                "IDR",
                -110744997000000, // this is Investing CF TTM Header Table
                52801140000000, // this is Financing CF TTM Header Table
                59217708000000, // this is Free Cash Flow TTM Header Table
                2452952000000 // this is CapEx TTM Header Table
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 8 Header Table
| Symbol | Fiscal period Current | Fiscal period end Current | Operating CF TTM | Investing CF TTM | Financing CF TTM | Free Cash Flow TTM | CapEx TTM |
| --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | 2026-Q1 | 2026-03-31 | 61.67T IDR | -110.74T IDR | 52.8T IDR | 59.22T IDR | 2.45T IDR |

## 12. Per share isinya:
Request URL:
```
https://scanner.tradingview.com/indonesia/scan?label-product=screener-stock
```
Request Method: POST
Request Payload:
```
{
    "columns": [
        "ticker-view",
        "revenue_per_share_ttm",
        "type",
        "typespecs",
        "fundamental_currency_code",
        "earnings_per_share_basic_ttm",
        "earnings_per_share_diluted_ttm",
        "operating_cash_flow_per_share_ttm",
        "free_cash_flow_per_share_ttm",
        "ebit_per_share_ttm",
        "ebitda_per_share_ttm",
        "book_value_per_share_fq",
        "total_debt_per_share_fq",
        "cash_per_share_fq"
    ],
    "filter": [
        {
            "left": "is_primary",
            "operation": "equal",
            "right": true
        }
    ],
    "ignore_unknown_fields": false,
    "options": {
        "lang": "en"
    },
    "range": [
        0,
        100
    ],
    "sort": {
        "sortBy": "market_cap_basic",
        "sortOrder": "desc"
    },
    "markets": [
        "indonesia"
    ],
    "filter2": {
        "operator": "and",
        "operands": [
            {
                "operation": {
                    "operator": "or",
                    "operands": [
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "common"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "stock"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has",
                                            "right": [
                                                "preferred"
                                            ]
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "dr"
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            "operation": {
                                "operator": "and",
                                "operands": [
                                    {
                                        "expression": {
                                            "left": "type",
                                            "operation": "equal",
                                            "right": "fund"
                                        }
                                    },
                                    {
                                        "expression": {
                                            "left": "typespecs",
                                            "operation": "has_none_of",
                                            "right": [
                                                "etf",
                                                "mutual"
                                            ]
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            },
            {
                "expression": {
                    "left": "typespecs",
                    "operation": "has_none_of",
                    "right": [
                        "pre-ipo"
                    ]
                }
            }
        ]
    }
}
```
Example Response JSON:
```
{
    "totalCount": 867,
    "data": [
        {
            "s": "IDX:BBCA",
            "d": [
                {
                    "description": "PT Bank Central Asia Tbk",
                    "exchange": "IDX",
                    "kind": "delay",
                    "kind-delay": 600,
                    "logo": {
                        "logoid": "bank-central-asia",
                        "style": "single"
                    },
                    "logoid": "bank-central-asia",
                    "name": "BBCA",
                    "type": "stock",
                    "typespecs": [
                        "common"
                    ]
                },
                929.3279079474933,
                "stock",
                [
                    "common"
                ],
                "IDR",
                471.5874,
                471.5874,
                501.825223534916,
                175.947471451493,
                null,
                null,
                2102.06694,
                55.4243549846389,
                669.3329996779703
            ]
        }
    ]
}
```
dari hasil response JSON nanti ada 11 Header Table
| Symbol | Revenue per share TTM | EPS basic TTM | EPS diluted TTM | Operating Cash Flow per Share TTM | Free Cash Flow per Share TTM | EBIT per share TTM | EBITDA per share TTM | Book per Share FQ | Total Debt per Share FQ | Cash per share FQ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| "https://s3-symbol-logo.tradingview.com/{data.d.logo.logoid}.svg"+{data.d.name}+{data.d.description} | 929.33 IDR | 471.59 IDR | 471.59 IDR | 501.83 IDR | 175.95 IDR | - | - | 2102.07 IDR | 55.42 IDR | 669.33 IDR |



# Jika Symbol pada row di tekan maka tampilkan rincian:
Request URL:
1 minute:
```
https://scanner.tradingview.com/symbol?symbol=IDX%3A{data.d.name}&fields=Recommend.Other%7C1%2CRecommend.All%7C1%2CRecommend.MA%7C1%2CRSI%7C1%2CRSI%5B1%5D%7C1%2CStoch.K%7C1%2CStoch.D%7C1%2CStoch.K%5B1%5D%7C1%2CStoch.D%5B1%5D%7C1%2CCCI20%7C1%2CCCI20%5B1%5D%7C1%2CADX%7C1%2CADX%2BDI%7C1%2CADX-DI%7C1%2CADX%2BDI%5B1%5D%7C1%2CADX-DI%5B1%5D%7C1%2CAO%7C1%2CAO%5B1%5D%7C1%2CAO%5B2%5D%7C1%2CMom%7C1%2CMom%5B1%5D%7C1%2CMACD.macd%7C1%2CMACD.signal%7C1%2CRec.Stoch.RSI%7C1%2CStoch.RSI.K%7C1%2CRec.WR%7C1%2CW.R%7C1%2CRec.BBPower%7C1%2CBBPower%7C1%2CRec.UO%7C1%2CUO%7C1%2CEMA10%7C1%2Cclose%7C1%2CSMA10%7C1%2CEMA20%7C1%2CSMA20%7C1%2CEMA30%7C1%2CSMA30%7C1%2CEMA50%7C1%2CSMA50%7C1%2CEMA100%7C1%2CSMA100%7C1%2CEMA200%7C1%2CSMA200%7C1%2CRec.Ichimoku%7C1%2CIchimoku.BLine%7C1%2CRec.VWMA%7C1%2CVWMA%7C1%2CRec.HullMA9%7C1%2CHullMA9%7C1%2CPivot.M.Classic.R3%7C1%2CPivot.M.Classic.R2%7C1%2CPivot.M.Classic.R1%7C1%2CPivot.M.Classic.Middle%7C1%2CPivot.M.Classic.S1%7C1%2CPivot.M.Classic.S2%7C1%2CPivot.M.Classic.S3%7C1%2CPivot.M.Fibonacci.R3%7C1%2CPivot.M.Fibonacci.R2%7C1%2CPivot.M.Fibonacci.R1%7C1%2CPivot.M.Fibonacci.Middle%7C1%2CPivot.M.Fibonacci.S1%7C1%2CPivot.M.Fibonacci.S2%7C1%2CPivot.M.Fibonacci.S3%7C1%2CPivot.M.Camarilla.R3%7C1%2CPivot.M.Camarilla.R2%7C1%2CPivot.M.Camarilla.R1%7C1%2CPivot.M.Camarilla.Middle%7C1%2CPivot.M.Camarilla.S1%7C1%2CPivot.M.Camarilla.S2%7C1%2CPivot.M.Camarilla.S3%7C1%2CPivot.M.Woodie.R3%7C1%2CPivot.M.Woodie.R2%7C1%2CPivot.M.Woodie.R1%7C1%2CPivot.M.Woodie.Middle%7C1%2CPivot.M.Woodie.S1%7C1%2CPivot.M.Woodie.S2%7C1%2CPivot.M.Woodie.S3%7C1%2CPivot.M.Demark.R1%7C1%2CPivot.M.Demark.Middle%7C1%2CPivot.M.Demark.S1%7C1&no_404=true&label-product=popup-technicals
```
5 minute:
```
https://scanner.tradingview.com/symbol?symbol=IDX%3A{data.d.name}&fields=Recommend.Other%7C5%2CRecommend.All%7C5%2CRecommend.MA%7C5%2CRSI%7C5%2CRSI%5B1%5D%7C5%2CStoch.K%7C5%2CStoch.D%7C5%2CStoch.K%5B1%5D%7C5%2CStoch.D%5B1%5D%7C5%2CCCI20%7C5%2CCCI20%5B1%5D%7C5%2CADX%7C5%2CADX%2BDI%7C5%2CADX-DI%7C5%2CADX%2BDI%5B1%5D%7C5%2CADX-DI%5B1%5D%7C5%2CAO%7C5%2CAO%5B1%5D%7C5%2CAO%5B2%5D%7C5%2CMom%7C5%2CMom%5B1%5D%7C5%2CMACD.macd%7C5%2CMACD.signal%7C5%2CRec.Stoch.RSI%7C5%2CStoch.RSI.K%7C5%2CRec.WR%7C5%2CW.R%7C5%2CRec.BBPower%7C5%2CBBPower%7C5%2CRec.UO%7C5%2CUO%7C5%2CEMA10%7C5%2Cclose%7C5%2CSMA10%7C5%2CEMA20%7C5%2CSMA20%7C5%2CEMA30%7C5%2CSMA30%7C5%2CEMA50%7C5%2CSMA50%7C5%2CEMA100%7C5%2CSMA100%7C5%2CEMA200%7C5%2CSMA200%7C5%2CRec.Ichimoku%7C5%2CIchimoku.BLine%7C5%2CRec.VWMA%7C5%2CVWMA%7C5%2CRec.HullMA9%7C5%2CHullMA9%7C5%2CPivot.M.Classic.R3%7C5%2CPivot.M.Classic.R2%7C5%2CPivot.M.Classic.R1%7C5%2CPivot.M.Classic.Middle%7C5%2CPivot.M.Classic.S1%7C5%2CPivot.M.Classic.S2%7C5%2CPivot.M.Classic.S3%7C5%2CPivot.M.Fibonacci.R3%7C5%2CPivot.M.Fibonacci.R2%7C5%2CPivot.M.Fibonacci.R1%7C5%2CPivot.M.Fibonacci.Middle%7C5%2CPivot.M.Fibonacci.S1%7C5%2CPivot.M.Fibonacci.S2%7C5%2CPivot.M.Fibonacci.S3%7C5%2CPivot.M.Camarilla.R3%7C5%2CPivot.M.Camarilla.R2%7C5%2CPivot.M.Camarilla.R1%7C5%2CPivot.M.Camarilla.Middle%7C5%2CPivot.M.Camarilla.S1%7C5%2CPivot.M.Camarilla.S2%7C5%2CPivot.M.Camarilla.S3%7C5%2CPivot.M.Woodie.R3%7C5%2CPivot.M.Woodie.R2%7C5%2CPivot.M.Woodie.R1%7C5%2CPivot.M.Woodie.Middle%7C5%2CPivot.M.Woodie.S1%7C5%2CPivot.M.Woodie.S2%7C5%2CPivot.M.Woodie.S3%7C5%2CPivot.M.Demark.R1%7C5%2CPivot.M.Demark.Middle%7C5%2CPivot.M.Demark.S1%7C5&no_404=true&label-product=popup-technicals
```
15 minutes:
```
https://scanner.tradingview.com/symbol?symbol=IDX%3A{data.d.name}&fields=Recommend.Other%7C15%2CRecommend.All%7C15%2CRecommend.MA%7C15%2CRSI%7C15%2CRSI%5B1%5D%7C15%2CStoch.K%7C15%2CStoch.D%7C15%2CStoch.K%5B1%5D%7C15%2CStoch.D%5B1%5D%7C15%2CCCI20%7C15%2CCCI20%5B1%5D%7C15%2CADX%7C15%2CADX%2BDI%7C15%2CADX-DI%7C15%2CADX%2BDI%5B1%5D%7C15%2CADX-DI%5B1%5D%7C15%2CAO%7C15%2CAO%5B1%5D%7C15%2CAO%5B2%5D%7C15%2CMom%7C15%2CMom%5B1%5D%7C15%2CMACD.macd%7C15%2CMACD.signal%7C15%2CRec.Stoch.RSI%7C15%2CStoch.RSI.K%7C15%2CRec.WR%7C15%2CW.R%7C15%2CRec.BBPower%7C15%2CBBPower%7C15%2CRec.UO%7C15%2CUO%7C15%2CEMA10%7C15%2Cclose%7C15%2CSMA10%7C15%2CEMA20%7C15%2CSMA20%7C15%2CEMA30%7C15%2CSMA30%7C15%2CEMA50%7C15%2CSMA50%7C15%2CEMA100%7C15%2CSMA100%7C15%2CEMA200%7C15%2CSMA200%7C15%2CRec.Ichimoku%7C15%2CIchimoku.BLine%7C15%2CRec.VWMA%7C15%2CVWMA%7C15%2CRec.HullMA9%7C15%2CHullMA9%7C15%2CPivot.M.Classic.R3%7C15%2CPivot.M.Classic.R2%7C15%2CPivot.M.Classic.R1%7C15%2CPivot.M.Classic.Middle%7C15%2CPivot.M.Classic.S1%7C15%2CPivot.M.Classic.S2%7C15%2CPivot.M.Classic.S3%7C15%2CPivot.M.Fibonacci.R3%7C15%2CPivot.M.Fibonacci.R2%7C15%2CPivot.M.Fibonacci.R1%7C15%2CPivot.M.Fibonacci.Middle%7C15%2CPivot.M.Fibonacci.S1%7C15%2CPivot.M.Fibonacci.S2%7C15%2CPivot.M.Fibonacci.S3%7C15%2CPivot.M.Camarilla.R3%7C15%2CPivot.M.Camarilla.R2%7C15%2CPivot.M.Camarilla.R1%7C15%2CPivot.M.Camarilla.Middle%7C15%2CPivot.M.Camarilla.S1%7C15%2CPivot.M.Camarilla.S2%7C15%2CPivot.M.Camarilla.S3%7C15%2CPivot.M.Woodie.R3%7C15%2CPivot.M.Woodie.R2%7C15%2CPivot.M.Woodie.R1%7C15%2CPivot.M.Woodie.Middle%7C15%2CPivot.M.Woodie.S1%7C15%2CPivot.M.Woodie.S2%7C15%2CPivot.M.Woodie.S3%7C15%2CPivot.M.Demark.R1%7C15%2CPivot.M.Demark.Middle%7C15%2CPivot.M.Demark.S1%7C15&no_404=true&label-product=popup-technicals
```
30 minutes:
```
https://scanner.tradingview.com/symbol?symbol=IDX%3A{data.d.name}&fields=Recommend.Other%7C30%2CRecommend.All%7C30%2CRecommend.MA%7C30%2CRSI%7C30%2CRSI%5B1%5D%7C30%2CStoch.K%7C30%2CStoch.D%7C30%2CStoch.K%5B1%5D%7C30%2CStoch.D%5B1%5D%7C30%2CCCI20%7C30%2CCCI20%5B1%5D%7C30%2CADX%7C30%2CADX%2BDI%7C30%2CADX-DI%7C30%2CADX%2BDI%5B1%5D%7C30%2CADX-DI%5B1%5D%7C30%2CAO%7C30%2CAO%5B1%5D%7C30%2CAO%5B2%5D%7C30%2CMom%7C30%2CMom%5B1%5D%7C30%2CMACD.macd%7C30%2CMACD.signal%7C30%2CRec.Stoch.RSI%7C30%2CStoch.RSI.K%7C30%2CRec.WR%7C30%2CW.R%7C30%2CRec.BBPower%7C30%2CBBPower%7C30%2CRec.UO%7C30%2CUO%7C30%2CEMA10%7C30%2Cclose%7C30%2CSMA10%7C30%2CEMA20%7C30%2CSMA20%7C30%2CEMA30%7C30%2CSMA30%7C30%2CEMA50%7C30%2CSMA50%7C30%2CEMA100%7C30%2CSMA100%7C30%2CEMA200%7C30%2CSMA200%7C30%2CRec.Ichimoku%7C30%2CIchimoku.BLine%7C30%2CRec.VWMA%7C30%2CVWMA%7C30%2CRec.HullMA9%7C30%2CHullMA9%7C30%2CPivot.M.Classic.R3%7C30%2CPivot.M.Classic.R2%7C30%2CPivot.M.Classic.R1%7C30%2CPivot.M.Classic.Middle%7C30%2CPivot.M.Classic.S1%7C30%2CPivot.M.Classic.S2%7C30%2CPivot.M.Classic.S3%7C30%2CPivot.M.Fibonacci.R3%7C30%2CPivot.M.Fibonacci.R2%7C30%2CPivot.M.Fibonacci.R1%7C30%2CPivot.M.Fibonacci.Middle%7C30%2CPivot.M.Fibonacci.S1%7C30%2CPivot.M.Fibonacci.S2%7C30%2CPivot.M.Fibonacci.S3%7C30%2CPivot.M.Camarilla.R3%7C30%2CPivot.M.Camarilla.R2%7C30%2CPivot.M.Camarilla.R1%7C30%2CPivot.M.Camarilla.Middle%7C30%2CPivot.M.Camarilla.S1%7C30%2CPivot.M.Camarilla.S2%7C30%2CPivot.M.Camarilla.S3%7C30%2CPivot.M.Woodie.R3%7C30%2CPivot.M.Woodie.R2%7C30%2CPivot.M.Woodie.R1%7C30%2CPivot.M.Woodie.Middle%7C30%2CPivot.M.Woodie.S1%7C30%2CPivot.M.Woodie.S2%7C30%2CPivot.M.Woodie.S3%7C30%2CPivot.M.Demark.R1%7C30%2CPivot.M.Demark.Middle%7C30%2CPivot.M.Demark.S1%7C30&no_404=true&label-product=popup-technicals
```
1 hour:
```
https://scanner.tradingview.com/symbol?symbol=IDX%3A{data.d.name}&fields=Recommend.Other%7C60%2CRecommend.All%7C60%2CRecommend.MA%7C60%2CRSI%7C60%2CRSI%5B1%5D%7C60%2CStoch.K%7C60%2CStoch.D%7C60%2CStoch.K%5B1%5D%7C60%2CStoch.D%5B1%5D%7C60%2CCCI20%7C60%2CCCI20%5B1%5D%7C60%2CADX%7C60%2CADX%2BDI%7C60%2CADX-DI%7C60%2CADX%2BDI%5B1%5D%7C60%2CADX-DI%5B1%5D%7C60%2CAO%7C60%2CAO%5B1%5D%7C60%2CAO%5B2%5D%7C60%2CMom%7C60%2CMom%5B1%5D%7C60%2CMACD.macd%7C60%2CMACD.signal%7C60%2CRec.Stoch.RSI%7C60%2CStoch.RSI.K%7C60%2CRec.WR%7C60%2CW.R%7C60%2CRec.BBPower%7C60%2CBBPower%7C60%2CRec.UO%7C60%2CUO%7C60%2CEMA10%7C60%2Cclose%7C60%2CSMA10%7C60%2CEMA20%7C60%2CSMA20%7C60%2CEMA30%7C60%2CSMA30%7C60%2CEMA50%7C60%2CSMA50%7C60%2CEMA100%7C60%2CSMA100%7C60%2CEMA200%7C60%2CSMA200%7C60%2CRec.Ichimoku%7C60%2CIchimoku.BLine%7C60%2CRec.VWMA%7C60%2CVWMA%7C60%2CRec.HullMA9%7C60%2CHullMA9%7C60%2CPivot.M.Classic.R3%7C60%2CPivot.M.Classic.R2%7C60%2CPivot.M.Classic.R1%7C60%2CPivot.M.Classic.Middle%7C60%2CPivot.M.Classic.S1%7C60%2CPivot.M.Classic.S2%7C60%2CPivot.M.Classic.S3%7C60%2CPivot.M.Fibonacci.R3%7C60%2CPivot.M.Fibonacci.R2%7C60%2CPivot.M.Fibonacci.R1%7C60%2CPivot.M.Fibonacci.Middle%7C60%2CPivot.M.Fibonacci.S1%7C60%2CPivot.M.Fibonacci.S2%7C60%2CPivot.M.Fibonacci.S3%7C60%2CPivot.M.Camarilla.R3%7C60%2CPivot.M.Camarilla.R2%7C60%2CPivot.M.Camarilla.R1%7C60%2CPivot.M.Camarilla.Middle%7C60%2CPivot.M.Camarilla.S1%7C60%2CPivot.M.Camarilla.S2%7C60%2CPivot.M.Camarilla.S3%7C60%2CPivot.M.Woodie.R3%7C60%2CPivot.M.Woodie.R2%7C60%2CPivot.M.Woodie.R1%7C60%2CPivot.M.Woodie.Middle%7C60%2CPivot.M.Woodie.S1%7C60%2CPivot.M.Woodie.S2%7C60%2CPivot.M.Woodie.S3%7C60%2CPivot.M.Demark.R1%7C60%2CPivot.M.Demark.Middle%7C60%2CPivot.M.Demark.S1%7C60&no_404=true&label-product=popup-technicals
```
2 hours:
```
https://scanner.tradingview.com/symbol?symbol=IDX%3A{data.d.name}&fields=Recommend.Other%7C120%2CRecommend.All%7C120%2CRecommend.MA%7C120%2CRSI%7C120%2CRSI%5B1%5D%7C120%2CStoch.K%7C120%2CStoch.D%7C120%2CStoch.K%5B1%5D%7C120%2CStoch.D%5B1%5D%7C120%2CCCI20%7C120%2CCCI20%5B1%5D%7C120%2CADX%7C120%2CADX%2BDI%7C120%2CADX-DI%7C120%2CADX%2BDI%5B1%5D%7C120%2CADX-DI%5B1%5D%7C120%2CAO%7C120%2CAO%5B1%5D%7C120%2CAO%5B2%5D%7C120%2CMom%7C120%2CMom%5B1%5D%7C120%2CMACD.macd%7C120%2CMACD.signal%7C120%2CRec.Stoch.RSI%7C120%2CStoch.RSI.K%7C120%2CRec.WR%7C120%2CW.R%7C120%2CRec.BBPower%7C120%2CBBPower%7C120%2CRec.UO%7C120%2CUO%7C120%2CEMA10%7C120%2Cclose%7C120%2CSMA10%7C120%2CEMA20%7C120%2CSMA20%7C120%2CEMA30%7C120%2CSMA30%7C120%2CEMA50%7C120%2CSMA50%7C120%2CEMA100%7C120%2CSMA100%7C120%2CEMA200%7C120%2CSMA200%7C120%2CRec.Ichimoku%7C120%2CIchimoku.BLine%7C120%2CRec.VWMA%7C120%2CVWMA%7C120%2CRec.HullMA9%7C120%2CHullMA9%7C120%2CPivot.M.Classic.R3%7C120%2CPivot.M.Classic.R2%7C120%2CPivot.M.Classic.R1%7C120%2CPivot.M.Classic.Middle%7C120%2CPivot.M.Classic.S1%7C120%2CPivot.M.Classic.S2%7C120%2CPivot.M.Classic.S3%7C120%2CPivot.M.Fibonacci.R3%7C120%2CPivot.M.Fibonacci.R2%7C120%2CPivot.M.Fibonacci.R1%7C120%2CPivot.M.Fibonacci.Middle%7C120%2CPivot.M.Fibonacci.S1%7C120%2CPivot.M.Fibonacci.S2%7C120%2CPivot.M.Fibonacci.S3%7C120%2CPivot.M.Camarilla.R3%7C120%2CPivot.M.Camarilla.R2%7C120%2CPivot.M.Camarilla.R1%7C120%2CPivot.M.Camarilla.Middle%7C120%2CPivot.M.Camarilla.S1%7C120%2CPivot.M.Camarilla.S2%7C120%2CPivot.M.Camarilla.S3%7C120%2CPivot.M.Woodie.R3%7C120%2CPivot.M.Woodie.R2%7C120%2CPivot.M.Woodie.R1%7C120%2CPivot.M.Woodie.Middle%7C120%2CPivot.M.Woodie.S1%7C120%2CPivot.M.Woodie.S2%7C120%2CPivot.M.Woodie.S3%7C120%2CPivot.M.Demark.R1%7C120%2CPivot.M.Demark.Middle%7C120%2CPivot.M.Demark.S1%7C120&no_404=true&label-product=popup-technicals
```
4 hours:
```
https://scanner.tradingview.com/symbol?symbol=IDX%3A{data.d.name}&fields=Recommend.Other%7C240%2CRecommend.All%7C240%2CRecommend.MA%7C240%2CRSI%7C240%2CRSI%5B1%5D%7C240%2CStoch.K%7C240%2CStoch.D%7C240%2CStoch.K%5B1%5D%7C240%2CStoch.D%5B1%5D%7C240%2CCCI20%7C240%2CCCI20%5B1%5D%7C240%2CADX%7C240%2CADX%2BDI%7C240%2CADX-DI%7C240%2CADX%2BDI%5B1%5D%7C240%2CADX-DI%5B1%5D%7C240%2CAO%7C240%2CAO%5B1%5D%7C240%2CAO%5B2%5D%7C240%2CMom%7C240%2CMom%5B1%5D%7C240%2CMACD.macd%7C240%2CMACD.signal%7C240%2CRec.Stoch.RSI%7C240%2CStoch.RSI.K%7C240%2CRec.WR%7C240%2CW.R%7C240%2CRec.BBPower%7C240%2CBBPower%7C240%2CRec.UO%7C240%2CUO%7C240%2CEMA10%7C240%2Cclose%7C240%2CSMA10%7C240%2CEMA20%7C240%2CSMA20%7C240%2CEMA30%7C240%2CSMA30%7C240%2CEMA50%7C240%2CSMA50%7C240%2CEMA100%7C240%2CSMA100%7C240%2CEMA200%7C240%2CSMA200%7C240%2CRec.Ichimoku%7C240%2CIchimoku.BLine%7C240%2CRec.VWMA%7C240%2CVWMA%7C240%2CRec.HullMA9%7C240%2CHullMA9%7C240%2CPivot.M.Classic.R3%7C240%2CPivot.M.Classic.R2%7C240%2CPivot.M.Classic.R1%7C240%2CPivot.M.Classic.Middle%7C240%2CPivot.M.Classic.S1%7C240%2CPivot.M.Classic.S2%7C240%2CPivot.M.Classic.S3%7C240%2CPivot.M.Fibonacci.R3%7C240%2CPivot.M.Fibonacci.R2%7C240%2CPivot.M.Fibonacci.R1%7C240%2CPivot.M.Fibonacci.Middle%7C240%2CPivot.M.Fibonacci.S1%7C240%2CPivot.M.Fibonacci.S2%7C240%2CPivot.M.Fibonacci.S3%7C240%2CPivot.M.Camarilla.R3%7C240%2CPivot.M.Camarilla.R2%7C240%2CPivot.M.Camarilla.R1%7C240%2CPivot.M.Camarilla.Middle%7C240%2CPivot.M.Camarilla.S1%7C240%2CPivot.M.Camarilla.S2%7C240%2CPivot.M.Camarilla.S3%7C240%2CPivot.M.Woodie.R3%7C240%2CPivot.M.Woodie.R2%7C240%2CPivot.M.Woodie.R1%7C240%2CPivot.M.Woodie.Middle%7C240%2CPivot.M.Woodie.S1%7C240%2CPivot.M.Woodie.S2%7C240%2CPivot.M.Woodie.S3%7C240%2CPivot.M.Demark.R1%7C240%2CPivot.M.Demark.Middle%7C240%2CPivot.M.Demark.S1%7C240&no_404=true&label-product=popup-technicals
```
1 day:
```
https://scanner.tradingview.com/symbol?symbol=IDX%3A{data.d.name}&fields=Recommend.Other%2CRecommend.All%2CRecommend.MA%2CRSI%2CRSI%5B1%5D%2CStoch.K%2CStoch.D%2CStoch.K%5B1%5D%2CStoch.D%5B1%5D%2CCCI20%2CCCI20%5B1%5D%2CADX%2CADX%2BDI%2CADX-DI%2CADX%2BDI%5B1%5D%2CADX-DI%5B1%5D%2CAO%2CAO%5B1%5D%2CAO%5B2%5D%2CMom%2CMom%5B1%5D%2CMACD.macd%2CMACD.signal%2CRec.Stoch.RSI%2CStoch.RSI.K%2CRec.WR%2CW.R%2CRec.BBPower%2CBBPower%2CRec.UO%2CUO%2CEMA10%2Cclose%2CSMA10%2CEMA20%2CSMA20%2CEMA30%2CSMA30%2CEMA50%2CSMA50%2CEMA100%2CSMA100%2CEMA200%2CSMA200%2CRec.Ichimoku%2CIchimoku.BLine%2CRec.VWMA%2CVWMA%2CRec.HullMA9%2CHullMA9%2CPivot.M.Classic.R3%2CPivot.M.Classic.R2%2CPivot.M.Classic.R1%2CPivot.M.Classic.Middle%2CPivot.M.Classic.S1%2CPivot.M.Classic.S2%2CPivot.M.Classic.S3%2CPivot.M.Fibonacci.R3%2CPivot.M.Fibonacci.R2%2CPivot.M.Fibonacci.R1%2CPivot.M.Fibonacci.Middle%2CPivot.M.Fibonacci.S1%2CPivot.M.Fibonacci.S2%2CPivot.M.Fibonacci.S3%2CPivot.M.Camarilla.R3%2CPivot.M.Camarilla.R2%2CPivot.M.Camarilla.R1%2CPivot.M.Camarilla.Middle%2CPivot.M.Camarilla.S1%2CPivot.M.Camarilla.S2%2CPivot.M.Camarilla.S3%2CPivot.M.Woodie.R3%2CPivot.M.Woodie.R2%2CPivot.M.Woodie.R1%2CPivot.M.Woodie.Middle%2CPivot.M.Woodie.S1%2CPivot.M.Woodie.S2%2CPivot.M.Woodie.S3%2CPivot.M.Demark.R1%2CPivot.M.Demark.Middle%2CPivot.M.Demark.S1&no_404=true&label-product=popup-technicals
```
1 week:
```
https://scanner.tradingview.com/symbol?symbol=IDX%3A{data.d.name}&fields=Recommend.Other%7C1W%2CRecommend.All%7C1W%2CRecommend.MA%7C1W%2CRSI%7C1W%2CRSI%5B1%5D%7C1W%2CStoch.K%7C1W%2CStoch.D%7C1W%2CStoch.K%5B1%5D%7C1W%2CStoch.D%5B1%5D%7C1W%2CCCI20%7C1W%2CCCI20%5B1%5D%7C1W%2CADX%7C1W%2CADX%2BDI%7C1W%2CADX-DI%7C1W%2CADX%2BDI%5B1%5D%7C1W%2CADX-DI%5B1%5D%7C1W%2CAO%7C1W%2CAO%5B1%5D%7C1W%2CAO%5B2%5D%7C1W%2CMom%7C1W%2CMom%5B1%5D%7C1W%2CMACD.macd%7C1W%2CMACD.signal%7C1W%2CRec.Stoch.RSI%7C1W%2CStoch.RSI.K%7C1W%2CRec.WR%7C1W%2CW.R%7C1W%2CRec.BBPower%7C1W%2CBBPower%7C1W%2CRec.UO%7C1W%2CUO%7C1W%2CEMA10%7C1W%2Cclose%7C1W%2CSMA10%7C1W%2CEMA20%7C1W%2CSMA20%7C1W%2CEMA30%7C1W%2CSMA30%7C1W%2CEMA50%7C1W%2CSMA50%7C1W%2CEMA100%7C1W%2CSMA100%7C1W%2CEMA200%7C1W%2CSMA200%7C1W%2CRec.Ichimoku%7C1W%2CIchimoku.BLine%7C1W%2CRec.VWMA%7C1W%2CVWMA%7C1W%2CRec.HullMA9%7C1W%2CHullMA9%7C1W%2CPivot.M.Classic.R3%7C1W%2CPivot.M.Classic.R2%7C1W%2CPivot.M.Classic.R1%7C1W%2CPivot.M.Classic.Middle%7C1W%2CPivot.M.Classic.S1%7C1W%2CPivot.M.Classic.S2%7C1W%2CPivot.M.Classic.S3%7C1W%2CPivot.M.Fibonacci.R3%7C1W%2CPivot.M.Fibonacci.R2%7C1W%2CPivot.M.Fibonacci.R1%7C1W%2CPivot.M.Fibonacci.Middle%7C1W%2CPivot.M.Fibonacci.S1%7C1W%2CPivot.M.Fibonacci.S2%7C1W%2CPivot.M.Fibonacci.S3%7C1W%2CPivot.M.Camarilla.R3%7C1W%2CPivot.M.Camarilla.R2%7C1W%2CPivot.M.Camarilla.R1%7C1W%2CPivot.M.Camarilla.Middle%7C1W%2CPivot.M.Camarilla.S1%7C1W%2CPivot.M.Camarilla.S2%7C1W%2CPivot.M.Camarilla.S3%7C1W%2CPivot.M.Woodie.R3%7C1W%2CPivot.M.Woodie.R2%7C1W%2CPivot.M.Woodie.R1%7C1W%2CPivot.M.Woodie.Middle%7C1W%2CPivot.M.Woodie.S1%7C1W%2CPivot.M.Woodie.S2%7C1W%2CPivot.M.Woodie.S3%7C1W%2CPivot.M.Demark.R1%7C1W%2CPivot.M.Demark.Middle%7C1W%2CPivot.M.Demark.S1%7C1W&no_404=true&label-product=popup-technicals
```
1 month:
```
https://scanner.tradingview.com/symbol?symbol=IDX%3A{data.d.name}&fields=Recommend.Other%7C1M%2CRecommend.All%7C1M%2CRecommend.MA%7C1M%2CRSI%7C1M%2CRSI%5B1%5D%7C1M%2CStoch.K%7C1M%2CStoch.D%7C1M%2CStoch.K%5B1%5D%7C1M%2CStoch.D%5B1%5D%7C1M%2CCCI20%7C1M%2CCCI20%5B1%5D%7C1M%2CADX%7C1M%2CADX%2BDI%7C1M%2CADX-DI%7C1M%2CADX%2BDI%5B1%5D%7C1M%2CADX-DI%5B1%5D%7C1M%2CAO%7C1M%2CAO%5B1%5D%7C1M%2CAO%5B2%5D%7C1M%2CMom%7C1M%2CMom%5B1%5D%7C1M%2CMACD.macd%7C1M%2CMACD.signal%7C1M%2CRec.Stoch.RSI%7C1M%2CStoch.RSI.K%7C1M%2CRec.WR%7C1M%2CW.R%7C1M%2CRec.BBPower%7C1M%2CBBPower%7C1M%2CRec.UO%7C1M%2CUO%7C1M%2CEMA10%7C1M%2Cclose%7C1M%2CSMA10%7C1M%2CEMA20%7C1M%2CSMA20%7C1M%2CEMA30%7C1M%2CSMA30%7C1M%2CEMA50%7C1M%2CSMA50%7C1M%2CEMA100%7C1M%2CSMA100%7C1M%2CEMA200%7C1M%2CSMA200%7C1M%2CRec.Ichimoku%7C1M%2CIchimoku.BLine%7C1M%2CRec.VWMA%7C1M%2CVWMA%7C1M%2CRec.HullMA9%7C1M%2CHullMA9%7C1M%2CPivot.M.Classic.R3%7C1M%2CPivot.M.Classic.R2%7C1M%2CPivot.M.Classic.R1%7C1M%2CPivot.M.Classic.Middle%7C1M%2CPivot.M.Classic.S1%7C1M%2CPivot.M.Classic.S2%7C1M%2CPivot.M.Classic.S3%7C1M%2CPivot.M.Fibonacci.R3%7C1M%2CPivot.M.Fibonacci.R2%7C1M%2CPivot.M.Fibonacci.R1%7C1M%2CPivot.M.Fibonacci.Middle%7C1M%2CPivot.M.Fibonacci.S1%7C1M%2CPivot.M.Fibonacci.S2%7C1M%2CPivot.M.Fibonacci.S3%7C1M%2CPivot.M.Camarilla.R3%7C1M%2CPivot.M.Camarilla.R2%7C1M%2CPivot.M.Camarilla.R1%7C1M%2CPivot.M.Camarilla.Middle%7C1M%2CPivot.M.Camarilla.S1%7C1M%2CPivot.M.Camarilla.S2%7C1M%2CPivot.M.Camarilla.S3%7C1M%2CPivot.M.Woodie.R3%7C1M%2CPivot.M.Woodie.R2%7C1M%2CPivot.M.Woodie.R1%7C1M%2CPivot.M.Woodie.Middle%7C1M%2CPivot.M.Woodie.S1%7C1M%2CPivot.M.Woodie.S2%7C1M%2CPivot.M.Woodie.S3%7C1M%2CPivot.M.Demark.R1%7C1M%2CPivot.M.Demark.Middle%7C1M%2CPivot.M.Demark.S1%7C1M&no_404=true&label-product=popup-technicals
```
Request Method: GET
Example Response JSON:
```
{
    "ADX": 16.89571135710292,
    "ADX+DI": 23.118255372000323,
    "ADX+DI[1]": 21.29944258300819,
    "ADX-DI": 27.821164854319758,
    "ADX-DI[1]": 30.086603306931824,
    "AO": -49.19117647058829,
    "AO[1]": -3.8235294117648664,
    "AO[2]": 69.85294117647027,
    "BBPower": -245.29103221211335,
    "CCI20": -10.262248681639202,
    "CCI20[1]": -33.475651259202245,
    "EMA10": 5859.804058169838,
    "EMA100": 6484.74773914527,
    "EMA20": 5887.1782744912925,
    "EMA200": 7123.390687545523,
    "EMA30": 5925.260895696338,
    "EMA50": 6065.9470344491365,
    "HullMA9": 5583.518518518518,
    "Ichimoku.BLine": 5685,
    "MACD.macd": -37.05454515493511,
    "MACD.signal": -16.396371014821028,
    "Mom": -275,
    "Mom[1]": -675,
    "Pivot.M.Camarilla.Middle": 5640,
    "Pivot.M.Camarilla.R1": 5708.583333333333,
    "Pivot.M.Camarilla.R2": 5867.166666666667,
    "Pivot.M.Camarilla.R3": 6025.75,
    "Pivot.M.Camarilla.S1": 5391.416666666667,
    "Pivot.M.Camarilla.S2": 5232.833333333333,
    "Pivot.M.Camarilla.S3": 5074.25,
    "Pivot.M.Classic.Middle": 5640,
    "Pivot.M.Classic.R1": 6460,
    "Pivot.M.Classic.R2": 7370,
    "Pivot.M.Classic.R3": 9100,
    "Pivot.M.Classic.S1": 4730,
    "Pivot.M.Classic.S2": 3910,
    "Pivot.M.Classic.S3": 2180,
    "Pivot.M.Demark.Middle": 5435,
    "Pivot.M.Demark.R1": 6050,
    "Pivot.M.Demark.S1": 4320,
    "Pivot.M.Fibonacci.Middle": 5640,
    "Pivot.M.Fibonacci.R1": 6300.86,
    "Pivot.M.Fibonacci.R2": 6709.14,
    "Pivot.M.Fibonacci.R3": 7370,
    "Pivot.M.Fibonacci.S1": 4979.14,
    "Pivot.M.Fibonacci.S2": 4570.86,
    "Pivot.M.Fibonacci.S3": 3910,
    "Pivot.M.Woodie.Middle": 5617.5,
    "Pivot.M.Woodie.R1": 6415,
    "Pivot.M.Woodie.R2": 7347.5,
    "Pivot.M.Woodie.R3": 8145,
    "Pivot.M.Woodie.S1": 4685,
    "Pivot.M.Woodie.S2": 3887.5,
    "Pivot.M.Woodie.S3": 2955,
    "RSI": 47.55901871218532,
    "RSI[1]": 42.88712684168583,
    "Rec.BBPower": 0,
    "Rec.HullMA9": 1,
    "Rec.Ichimoku": 0,
    "Rec.Stoch.RSI": 0,
    "Rec.UO": 0,
    "Rec.VWMA": 1,
    "Rec.WR": 0,
    "Recommend.All": -0.28787878787878785,
    "Recommend.MA": -0.6666666666666666,
    "Recommend.Other": 0.09090909090909091,
    "SMA10": 5965,
    "SMA100": 6526.25,
    "SMA20": 5808.75,
    "SMA200": 7291.125,
    "SMA30": 5840,
    "SMA50": 5979.5,
    "Stoch.D": 35.876393997781264,
    "Stoch.D[1]": 13.858722976370027,
    "Stoch.K": 19.090909090909083,
    "Stoch.K[1]": 3.627450980392157,
    "Stoch.RSI.K": 13.770979208977954,
    "UO": 32.84109872097227,
    "VWMA": 5668.275652533275,
    "W.R": -75,
    "close": 5800
}
```
dari hasil Response ada 3 Action (Buy, Neutral, Sell) tetapi saya tidak tahu kondisinya apa untuk Action (Buy, Neutral, Sell).
| Name | Value | Action |
|-----|-----|-----|
| Relative Strength Index (14) | 48 | Neutral |
| Stochastic %K (14, 3, 3) | 19 | Neutral |
| Commodity Channel Index (20) | −10 | Neutral |
| Average Directional Index (14) | 17 | Neutral |
| Awesome Oscillator | −49 | Neutral |
| Momentum (10) | −275 | Buy |
| MACD Level (12, 26) | −37 | Sell |
| Stochastic RSI Fast (3, 3, 14, 14) | 14 | Neutral |
| Williams Percent Range (14) | −75 | Neutral |
| Bull Bear Power | −245 | Neutral |
| Ultimate Oscillator (7, 14, 28) | 33 | Neutral |

| Name | Value | Action |
|-----|-----|-----|
| Exponential Moving Average (10) | 5,860 | Sell |
| Simple Moving Average (10) | 5,965 | Sell |
| Exponential Moving Average (20) | 5,887 | Sell |
| Simple Moving Average (20) | 5,809 | Sell |
| Exponential Moving Average (30) | 5,925 | Sell |
| Simple Moving Average (30) | 5,840 | Sell |
| Exponential Moving Average (50) | 6,066 | Sell |
| Simple Moving Average (50) | 5,980 | Sell |
| Exponential Moving Average (100) | 6,485 | Sell |
| Simple Moving Average (100) | 6,526 | Sell |
| Exponential Moving Average (200) | 7,123 | Sell |
| Simple Moving Average (200) | 7,291 | Sell |
| Ichimoku Base Line (9, 26, 52, 26) | 5,685 | Neutral |
| Volume Weighted Moving Average (20) | 5,668 | Buy |
| Hull Moving Average (9) | 5,584 | Buy |

| Pivot | Classic | Fibonacci | Camarilla | Woodie | DM |
|-----|-----|-----|-----|-----|-----|
| R3 | 9,100 | 7,370 | 6,026 | 8,145 | — |
| R2 | 7,370 | 6,709 | 5,867 | 7,348 | — |
| R1 | 6,460 | 6,301 | 5,709 | 6,415 | 6,050 |
| P | 5,640 | 5,640 | 5,640 | 5,618 | 5,435 |
| S1 | 4,730 | 4,979 | 5,391 | 4,685 | 4,320 |
| S2 | 3,910 | 4,571 | 5,233 | 3,888 | — |
| S3 | 2,180 | 3,910 | 5,074 | 2,955 | — |
