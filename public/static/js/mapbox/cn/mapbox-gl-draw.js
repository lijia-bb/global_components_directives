!function (e) {
  if ('object' == typeof exports && 'undefined' != typeof module) module.exports = e(); else if ('function' == typeof define && define.amd) define([], e); else {
    ('undefined' != typeof window ? window : 'undefined' != typeof global ? global : 'undefined' != typeof self ? self : this).MapboxDraw = e()
  }
}(function () {
  return function e (t, n, o) {
    function r (s, a) {
      if (!n[s]) {
        if (!t[s]) {
          var c = 'function' == typeof require && require
          if (!a && c) return c(s, !0)
          if (i) return i(s, !0)
          var u = new Error('Cannot find module \'' + s + '\'')
          throw u.code = 'MODULE_NOT_FOUND', u
        }
        var l = n[s] = { exports: {} }
        t[s][0].call(l.exports, function (e) {
          var n = t[s][1][e]
          return r(n || e)
        }, l, l.exports, e, t, n, o)
      }
      return n[s].exports
    }

    for (var i = 'function' == typeof require && require, s = 0; s < o.length; s++) r(o[s])
    return r
  }({
    1: [function (e, t, n) {
      'use strict'
      var o = e('./src/setup'), r = e('./src/options'), i = e('./src/api'), s = e('./src/constants')
      t.exports = function (e) {
        !function (e, t) {
          var n = { options: e = r(e) }
          t = i(n, t), n.api = t
          var a = o(n)
          t.onAdd = a.onAdd, t.onRemove = a.onRemove, t.types = s.types, t.options = e
        }(e, this)
      }, t.exports.modes = e('./src/modes')
    }, { './src/api': 22, './src/constants': 23, './src/modes': 56, './src/options': 61, './src/setup': 63 }],
    2: [function (e, t, n) {
      function o (e) {
        if (!(this instanceof o)) return new o(e)
        this._bbox = e || [1 / 0, 1 / 0, -1 / 0, -1 / 0], this._valid = !!e
      }

      t.exports = o, o.prototype.include = function (e) {
        return this._valid = !0, this._bbox[0] = Math.min(this._bbox[0], e[0]), this._bbox[1] = Math.min(this._bbox[1], e[1]), this._bbox[2] = Math.max(this._bbox[2], e[0]), this._bbox[3] = Math.max(this._bbox[3], e[1]), this
      }, o.prototype.equals = function (e) {
        var t
        return t = e instanceof o ? e.bbox() : e, this._bbox[0] == t[0] && this._bbox[1] == t[1] && this._bbox[2] == t[2] && this._bbox[3] == t[3]
      }, o.prototype.center = function (e) {
        return this._valid ? [(this._bbox[0] + this._bbox[2]) / 2, (this._bbox[1] + this._bbox[3]) / 2] : null
      }, o.prototype.union = function (e) {
        var t
        return this._valid = !0, t = e instanceof o ? e.bbox() : e, this._bbox[0] = Math.min(this._bbox[0], t[0]), this._bbox[1] = Math.min(this._bbox[1], t[1]), this._bbox[2] = Math.max(this._bbox[2], t[2]), this._bbox[3] = Math.max(this._bbox[3], t[3]), this
      }, o.prototype.bbox = function () {
        return this._valid ? this._bbox : null
      }, o.prototype.contains = function (e) {
        if (!e) return this._fastContains()
        if (!this._valid) return null
        var t = e[0], n = e[1]
        return this._bbox[0] <= t && this._bbox[1] <= n && this._bbox[2] >= t && this._bbox[3] >= n
      }, o.prototype.intersect = function (e) {
        return this._valid ? (t = e instanceof o ? e.bbox() : e, !(this._bbox[0] > t[2] || this._bbox[2] < t[0] || this._bbox[3] < t[1] || this._bbox[1] > t[3])) : null
        var t
      }, o.prototype._fastContains = function () {
        if (!this._valid) return new Function('return null;')
        var e = 'return ' + this._bbox[0] + '<= ll[0] &&' + this._bbox[1] + '<= ll[1] &&' + this._bbox[2] + '>= ll[0] &&' + this._bbox[3] + '>= ll[1]'
        return new Function('ll', e)
      }, o.prototype.polygon = function () {
        return this._valid ? {
          type: 'Polygon',
          coordinates: [[[this._bbox[0], this._bbox[1]], [this._bbox[2], this._bbox[1]], [this._bbox[2], this._bbox[3]], [this._bbox[0], this._bbox[3]], [this._bbox[0], this._bbox[1]]]]
        } : null
      }
    }, {}],
    3: [function (e, t, n) {
      var o = e('wgs84')

      function r (e) {
        var t = 0
        if (e && e.length > 0) {
          t += Math.abs(i(e[0]))
          for (var n = 1; n < e.length; n++) t -= Math.abs(i(e[n]))
        }
        return t
      }

      function i (e) {
        var t, n, r, i, a, c, u = 0, l = e.length
        if (l > 2) {
          for (c = 0; c < l; c++) c === l - 2 ? (r = l - 2, i = l - 1, a = 0) : c === l - 1 ? (r = l - 1, i = 0, a = 1) : (r = c, i = c + 1, a = c + 2), t = e[r], n = e[i], u += (s(e[a][0]) - s(t[0])) * Math.sin(s(n[1]))
          u = u * o.RADIUS * o.RADIUS / 2
        }
        return u
      }

      function s (e) {
        return e * Math.PI / 180
      }

      t.exports.geometry = function e (t) {
        var n, o = 0
        switch (t.type) {
          case 'Polygon':
            return r(t.coordinates)
          case 'MultiPolygon':
            for (n = 0; n < t.coordinates.length; n++) o += r(t.coordinates[n])
            return o
          case 'Point':
          case 'MultiPoint':
          case 'LineString':
          case 'MultiLineString':
            return 0
          case 'GeometryCollection':
            for (n = 0; n < t.geometries.length; n++) o += e(t.geometries[n])
            return o
        }
      }, t.exports.ring = i
    }, { wgs84: 20 }],
    4: [function (e, t, n) {
      t.exports = function (e) {
        return function e (t) {
          if (Array.isArray(t) && t.length && 'number' == typeof t[0]) return [t]
          return t.reduce(function (t, n) {
            return Array.isArray(n) && Array.isArray(n[0]) ? t.concat(e(n)) : (t.push(n), t)
          }, [])
        }(e)
      }
    }, {}],
    5: [function (e, t, n) {
      var o = e('@mapbox/geojson-normalize'), r = e('geojson-flatten'), i = e('./flatten')
      t.exports = function (e) {
        if (!e) return []
        var t = []
        return r(o(e)).features.forEach(function (e) {
          e.geometry && (t = t.concat(i(e.geometry.coordinates)))
        }), t
      }
    }, { './flatten': 4, '@mapbox/geojson-normalize': 7, 'geojson-flatten': 13 }],
    6: [function (e, t, n) {
      var o = e('@mapbox/geojson-coords'), r = e('traverse'), i = e('@mapbox/extent'), s = {
        features: ['FeatureCollection'],
        coordinates: ['Point', 'MultiPoint', 'LineString', 'MultiLineString', 'Polygon', 'MultiPolygon'],
        geometry: ['Feature'],
        geometries: ['GeometryCollection']
      }, a = Object.keys(s)

      function c (e) {
        for (var t = i(), n = o(e), r = 0; r < n.length; r++) t.include(n[r])
        return t
      }

      t.exports = function (e) {
        return c(e).bbox()
      }, t.exports.polygon = function (e) {
        return c(e).polygon()
      }, t.exports.bboxify = function (e) {
        return r(e).map(function (e) {
          e && (a.some(function (t) {
            return !!e[t] && -1 !== s[t].indexOf(e.type)
          }) && (e.bbox = c(e).bbox(), this.update(e)))
        })
      }
    }, { '@mapbox/extent': 2, '@mapbox/geojson-coords': 5, traverse: 19 }],
    7: [function (e, t, n) {
      t.exports = function (e) {
        if (!e || !e.type) return null
        var t = o[e.type]
        if (!t) return null
        if ('geometry' === t) return {
          type: 'FeatureCollection',
          features: [{ type: 'Feature', properties: {}, geometry: e }]
        }
        if ('feature' === t) return { type: 'FeatureCollection', features: [e] }
        if ('featurecollection' === t) return e
      }
      var o = {
        Point: 'geometry',
        MultiPoint: 'geometry',
        LineString: 'geometry',
        MultiLineString: 'geometry',
        Polygon: 'geometry',
        MultiPolygon: 'geometry',
        GeometryCollection: 'geometry',
        Feature: 'feature',
        FeatureCollection: 'featurecollection'
      }
    }, {}],
    8: [function (e, t, n) {
      var o = e('jsonlint-lines'), r = e('./object')
      t.exports.hint = function (e, t) {
        var n, i = []
        if ('object' == typeof e) n = e; else {
          if ('string' != typeof e) return [{ message: 'Expected string or object as input', line: 0 }]
          try {
            n = o.parse(e)
          } catch (e) {
            var s = e.message.match(/line (\d+)/)
            return [{ line: parseInt(s[1], 10) - 1, message: e.message, error: e }]
          }
        }
        return i = i.concat(r.hint(n, t))
      }
    }, { './object': 9, 'jsonlint-lines': 15 }],
    9: [function (e, t, n) {
      var o = e('./rhr')
      t.exports.hint = function (e, t) {
        var n = [], r = 0, i = 10, s = 6

        function a (e) {
          if (t && !1 === t.noDuplicateMembers || !e.__duplicateProperties__ || n.push({
            message: 'An object contained duplicate members, making parsing ambigous: ' + e.__duplicateProperties__.join(', '),
            line: e.__line__
          }), !u(e, 'type', 'string')) if (g[e.type]) e && g[e.type](e); else {
            var o = y[e.type.toLowerCase()]
            void 0 !== o ? n.push({
              message: 'Expected ' + o + ' but got ' + e.type + ' (case sensitive)',
              line: e.__line__
            }) : n.push({ message: 'The type ' + e.type + ' is unknown', line: e.__line__ })
          }
        }

        function c (e, t) {
          return e.every(function (e) {
            return null !== e && typeof e === t
          })
        }

        function u (e, t, o) {
          if (void 0 === e[t]) return n.push({ message: '"' + t + '" member required', line: e.__line__ })
          if ('array' === o) {
            if (!Array.isArray(e[t])) return n.push({
              message: '"' + t + '" member should be an array, but is an ' + typeof e[t] + ' instead',
              line: e.__line__
            })
          } else {
            if ('object' === o && e[t] && 'Object' !== e[t].constructor.name) return n.push({
              message: '"' + t + '" member should be ' + o + ', but is an ' + e[t].constructor.name + ' instead',
              line: e.__line__
            })
            if (o && typeof e[t] !== o) return n.push({
              message: '"' + t + '" member should be ' + o + ', but is an ' + typeof e[t] + ' instead',
              line: e.__line__
            })
          }
        }

        function l (e, o) {
          if (!Array.isArray(e)) return n.push({
            message: 'position should be an array, is a ' + typeof e + ' instead',
            line: e.__line__ || o
          })
          if (e.length < 2) return n.push({
            message: 'position must have 2 or more elements',
            line: e.__line__ || o
          })
          if (e.length > 3) return n.push({
            message: 'position should not have more than 3 elements',
            level: 'message',
            line: e.__line__ || o
          })
          if (!c(e, 'number')) return n.push({
            message: 'each element in a position must be a number',
            line: e.__line__ || o
          })
          if (t && t.precisionWarning) {
            if (r === i) return r += 1, n.push({
              message: 'truncated warnings: we\'ve encountered coordinate precision warning ' + i + ' times, no more warnings will be reported',
              level: 'message',
              line: e.__line__ || o
            })
            r < i && e.forEach(function (t) {
              var i = 0, a = String(t).split('.')[1]
              if (void 0 !== a && (i = a.length), i > s) return r += 1, n.push({
                message: 'precision of coordinates should be reduced',
                level: 'message',
                line: e.__line__ || o
              })
            })
          }
        }

        function p (e, t, o, r) {
          if (void 0 === r && void 0 !== e.__line__ && (r = e.__line__), 0 === o) return l(e, r)
          if (1 === o && t) if ('LinearRing' === t) {
            if (!Array.isArray(e[e.length - 1])) return n.push({
              message: 'a number was found where a coordinate array should have been found: this needs to be nested more deeply',
              line: r
            }), !0
            if (e.length < 4 && n.push({
              message: 'a LinearRing of coordinates needs to have four or more positions',
              line: r
            }), e.length && (e[e.length - 1].length !== e[0].length || !e[e.length - 1].every(function (t, n) {
              return e[0][n] === t
            }))) return n.push({
              message: 'the first and last positions in a LinearRing of coordinates must be the same',
              line: r
            }), !0
          } else if ('Line' === t && e.length < 2) return n.push({
            message: 'a line needs to have two or more coordinates to be valid',
            line: r
          })
          if (Array.isArray(e)) return e.map(function (e) {
            return p(e, t, o - 1, e.__line__ || r)
          }).some(function (e) {
            return e
          })
          n.push({
            message: 'a number was found where a coordinate array should have been found: this needs to be nested more deeply',
            line: r
          })
        }

        function f (e) {
          e.crs && ('object' == typeof e.crs && e.crs.properties && 'urn:ogc:def:crs:OGC:1.3:CRS84' === e.crs.properties.name ? n.push({
            message: 'old-style crs member is not recommended, this object is equivalent to the default and should be removed',
            line: e.__line__
          }) : n.push({ message: 'old-style crs member is not recommended', line: e.__line__ }))
        }

        function h (e) {
          if (e.bbox) return Array.isArray(e.bbox) ? (c(e.bbox, 'number') || n.push({
            message: 'each element in a bbox member must be a number',
            line: e.bbox.__line__
          }), 4 !== e.bbox.length && 6 !== e.bbox.length && n.push({
            message: 'bbox must contain 4 elements (for 2D) or 6 elements (for 3D)',
            line: e.bbox.__line__
          }), n.length) : void n.push({
            message: 'bbox member must be an array of numbers, but is a ' + typeof e.bbox,
            line: e.__line__
          })
        }

        function d (e) {
          f(e), h(e), void 0 !== e.id && 'string' != typeof e.id && 'number' != typeof e.id && n.push({
            message: 'Feature "id" member must have a string or number value',
            line: e.__line__
          }), void 0 !== e.features && n.push({
            message: 'Feature object cannot contain a "features" member',
            line: e.__line__
          }), void 0 !== e.coordinates && n.push({
            message: 'Feature object cannot contain a "coordinates" member',
            line: e.__line__
          }), 'Feature' !== e.type && n.push({
            message: 'GeoJSON features must have a type=feature member',
            line: e.__line__
          }), u(e, 'properties', 'object'), u(e, 'geometry', 'object') || e.geometry && a(e.geometry)
        }

        var g = {
          Point: function (e) {
            var t
            f(e), h(e), void 0 !== (t = e).properties && n.push({
              message: 'geometry object cannot contain a "properties" member',
              line: t.__line__
            }), void 0 !== t.geometry && n.push({
              message: 'geometry object cannot contain a "geometry" member',
              line: t.__line__
            }), void 0 !== t.features && n.push({
              message: 'geometry object cannot contain a "features" member',
              line: t.__line__
            }), u(e, 'coordinates', 'array') || l(e.coordinates)
          }, Feature: d, MultiPoint: function (e) {
            f(e), h(e), u(e, 'coordinates', 'array') || p(e.coordinates, '', 1)
          }, LineString: function (e) {
            f(e), h(e), u(e, 'coordinates', 'array') || p(e.coordinates, 'Line', 1)
          }, MultiLineString: function (e) {
            f(e), h(e), u(e, 'coordinates', 'array') || p(e.coordinates, 'Line', 2)
          }, FeatureCollection: function (e) {
            if (f(e), h(e), void 0 !== e.properties && n.push({
              message: 'FeatureCollection object cannot contain a "properties" member',
              line: e.__line__
            }), void 0 !== e.coordinates && n.push({
              message: 'FeatureCollection object cannot contain a "coordinates" member',
              line: e.__line__
            }), !u(e, 'features', 'array')) {
              if (!c(e.features, 'object')) return n.push({
                message: 'Every feature must be an object',
                line: e.__line__
              })
              e.features.forEach(d)
            }
          }, GeometryCollection: function (e) {
            f(e), h(e), u(e, 'geometries', 'array') || (c(e.geometries, 'object') || n.push({
              message: 'The geometries array in a GeometryCollection must contain only geometry objects',
              line: e.__line__
            }), 1 === e.geometries.length && n.push({
              message: 'GeometryCollection with a single geometry should be avoided in favor of single part or a single object of multi-part type',
              line: e.geometries.__line__
            }), e.geometries.forEach(function (t) {
              t && ('GeometryCollection' === t.type && n.push({
                message: 'GeometryCollection should avoid nested geometry collections',
                line: e.geometries.__line__
              }), a(t))
            }))
          }, Polygon: function (e) {
            f(e), h(e), u(e, 'coordinates', 'array') || p(e.coordinates, 'LinearRing', 2) || o(e, n)
          }, MultiPolygon: function (e) {
            f(e), h(e), u(e, 'coordinates', 'array') || p(e.coordinates, 'LinearRing', 3) || o(e, n)
          }
        }, y = Object.keys(g).reduce(function (e, t) {
          return e[t.toLowerCase()] = t, e
        }, {})
        return 'object' != typeof e || null === e || void 0 === e ? (n.push({
          message: 'The root of a GeoJSON object must be an object.',
          line: 0
        }), n) : (a(e), n.forEach(function (e) {
          ({}).hasOwnProperty.call(e, 'line') && void 0 === e.line && delete e.line
        }), n)
      }
    }, { './rhr': 10 }],
    10: [function (e, t, n) {
      function o (e) {
        return e * Math.PI / 180
      }

      function r (e) {
        var t = 0
        if (e.length > 2) for (var n, r, i = 0; i < e.length - 1; i++) n = e[i], t += o((r = e[i + 1])[0] - n[0]) * (2 + Math.sin(o(n[1])) + Math.sin(o(r[1])))
        return t >= 0
      }

      function i (e) {
        if (e && e.length > 0) {
          if (r(e[0])) return !1
          if (!e.slice(1, e.length).every(r)) return !1
        }
        return !0
      }

      t.exports = function (e, t) {
        (function (e) {
          return 'Polygon' === e.type ? i(e.coordinates) : 'MultiPolygon' === e.type ? e.coordinates.every(i) : void 0
        })(e) || t.push({
          message: 'Polygons and MultiPolygons should follow the right-hand rule',
          level: 'message',
          line: e.__line__
        })
      }
    }, {}],
    11: [function (e, t, n) {
      'use strict'

      function o (e, t) {
        this.x = e, this.y = t
      }

      t.exports = o, o.prototype = {
        clone: function () {
          return new o(this.x, this.y)
        }, add: function (e) {
          return this.clone()._add(e)
        }, sub: function (e) {
          return this.clone()._sub(e)
        }, multByPoint: function (e) {
          return this.clone()._multByPoint(e)
        }, divByPoint: function (e) {
          return this.clone()._divByPoint(e)
        }, mult: function (e) {
          return this.clone()._mult(e)
        }, div: function (e) {
          return this.clone()._div(e)
        }, rotate: function (e) {
          return this.clone()._rotate(e)
        }, rotateAround: function (e, t) {
          return this.clone()._rotateAround(e, t)
        }, matMult: function (e) {
          return this.clone()._matMult(e)
        }, unit: function () {
          return this.clone()._unit()
        }, perp: function () {
          return this.clone()._perp()
        }, round: function () {
          return this.clone()._round()
        }, mag: function () {
          return Math.sqrt(this.x * this.x + this.y * this.y)
        }, equals: function (e) {
          return this.x === e.x && this.y === e.y
        }, dist: function (e) {
          return Math.sqrt(this.distSqr(e))
        }, distSqr: function (e) {
          var t = e.x - this.x, n = e.y - this.y
          return t * t + n * n
        }, angle: function () {
          return Math.atan2(this.y, this.x)
        }, angleTo: function (e) {
          return Math.atan2(this.y - e.y, this.x - e.x)
        }, angleWith: function (e) {
          return this.angleWithSep(e.x, e.y)
        }, angleWithSep: function (e, t) {
          return Math.atan2(this.x * t - this.y * e, this.x * e + this.y * t)
        }, _matMult: function (e) {
          var t = e[0] * this.x + e[1] * this.y, n = e[2] * this.x + e[3] * this.y
          return this.x = t, this.y = n, this
        }, _add: function (e) {
          return this.x += e.x, this.y += e.y, this
        }, _sub: function (e) {
          return this.x -= e.x, this.y -= e.y, this
        }, _mult: function (e) {
          return this.x *= e, this.y *= e, this
        }, _div: function (e) {
          return this.x /= e, this.y /= e, this
        }, _multByPoint: function (e) {
          return this.x *= e.x, this.y *= e.y, this
        }, _divByPoint: function (e) {
          return this.x /= e.x, this.y /= e.y, this
        }, _unit: function () {
          return this._div(this.mag()), this
        }, _perp: function () {
          var e = this.y
          return this.y = this.x, this.x = -e, this
        }, _rotate: function (e) {
          var t = Math.cos(e), n = Math.sin(e), o = t * this.x - n * this.y, r = n * this.x + t * this.y
          return this.x = o, this.y = r, this
        }, _rotateAround: function (e, t) {
          var n = Math.cos(e), o = Math.sin(e), r = t.x + n * (this.x - t.x) - o * (this.y - t.y),
            i = t.y + o * (this.x - t.x) + n * (this.y - t.y)
          return this.x = r, this.y = i, this
        }, _round: function () {
          return this.x = Math.round(this.x), this.y = Math.round(this.y), this
        }
      }, o.convert = function (e) {
        return e instanceof o ? e : Array.isArray(e) ? new o(e[0], e[1]) : e
      }
    }, {}],
    12: [function (e, t, n) {
    }, {}],
    13: [function (e, t, n) {
      t.exports = function e (t) {
        switch (t && t.type || null) {
          case 'FeatureCollection':
            return t.features = t.features.reduce(function (t, n) {
              return t.concat(e(n))
            }, []), t
          case 'Feature':
            return t.geometry ? e(t.geometry).map(function (e) {
              return { type: 'Feature', properties: JSON.parse(JSON.stringify(t.properties)), geometry: e }
            }) : t
          case 'MultiPoint':
            return t.coordinates.map(function (e) {
              return { type: 'Point', coordinates: e }
            })
          case 'MultiPolygon':
            return t.coordinates.map(function (e) {
              return { type: 'Polygon', coordinates: e }
            })
          case 'MultiLineString':
            return t.coordinates.map(function (e) {
              return { type: 'LineString', coordinates: e }
            })
          case 'GeometryCollection':
            return t.geometries.map(e).reduce(function (e, t) {
              return e.concat(t)
            }, [])
          case 'Point':
          case 'Polygon':
          case 'LineString':
            return [t]
        }
      }
    }, {}],
    14: [function (e, t, n) {
      var o = t.exports = function (e, t) {
        if (t || (t = 16), void 0 === e && (e = 128), e <= 0) return '0'
        for (var n = Math.log(Math.pow(2, e)) / Math.log(t), r = 2; n === 1 / 0; r *= 2) n = Math.log(Math.pow(2, e / r)) / Math.log(t) * r
        var i = n - Math.floor(n), s = ''
        for (r = 0; r < Math.floor(n); r++) {
          s = Math.floor(Math.random() * t).toString(t) + s
        }
        if (i) {
          var a = Math.pow(t, i)
          s = Math.floor(Math.random() * a).toString(t) + s
        }
        var c = parseInt(s, t)
        return c !== 1 / 0 && c >= Math.pow(2, e) ? o(e, t) : s
      }
      o.rack = function (e, t, n) {
        var r = function (r) {
          var s = 0
          do {
            if (s++ > 10) {
              if (!n) throw new Error('too many ID collisions, use more bits')
              e += n
            }
            var a = o(e, t)
          } while (Object.hasOwnProperty.call(i, a))
          return i[a] = r, a
        }, i = r.hats = {}
        return r.get = function (e) {
          return r.hats[e]
        }, r.set = function (e, t) {
          return r.hats[e] = t, r
        }, r.bits = e || 128, r.base = t || 16, r
      }
    }, {}],
    15: [function (e, t, n) {
      (function (o) {
        var r = function () {
          var e = function (e, t, n, o) {
            for (n = n || {}, o = e.length; o--; n[e[o]] = t);
            return n
          }, t = [1, 12], n = [1, 13], o = [1, 9], r = [1, 10], i = [1, 11], s = [1, 14], a = [1, 15],
            c = [14, 18, 22, 24], u = [18, 22], l = [22, 24], p = {
              trace: function () {
              },
              yy: {},
              symbols_: {
                error: 2,
                JSONString: 3,
                STRING: 4,
                JSONNumber: 5,
                NUMBER: 6,
                JSONNullLiteral: 7,
                NULL: 8,
                JSONBooleanLiteral: 9,
                TRUE: 10,
                FALSE: 11,
                JSONText: 12,
                JSONValue: 13,
                EOF: 14,
                JSONObject: 15,
                JSONArray: 16,
                '{': 17,
                '}': 18,
                JSONMemberList: 19,
                JSONMember: 20,
                ':': 21,
                ',': 22,
                '[': 23,
                ']': 24,
                JSONElementList: 25,
                $accept: 0,
                $end: 1
              },
              terminals_: {
                2: 'error',
                4: 'STRING',
                6: 'NUMBER',
                8: 'NULL',
                10: 'TRUE',
                11: 'FALSE',
                14: 'EOF',
                17: '{',
                18: '}',
                21: ':',
                22: ',',
                23: '[',
                24: ']'
              },
              productions_: [0, [3, 1], [5, 1], [7, 1], [9, 1], [9, 1], [12, 2], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [15, 2], [15, 3], [20, 3], [19, 1], [19, 3], [16, 2], [16, 3], [25, 1], [25, 3]],
              performAction: function (e, t, n, o, r, i, s) {
                var a = i.length - 1
                switch (r) {
                  case 1:
                    this.$ = e.replace(/\\(\\|")/g, '$1').replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t').replace(/\\v/g, '\v').replace(/\\f/g, '\f').replace(/\\b/g, '\b')
                    break
                  case 2:
                    this.$ = Number(e)
                    break
                  case 3:
                    this.$ = null
                    break
                  case 4:
                    this.$ = !0
                    break
                  case 5:
                    this.$ = !1
                    break
                  case 6:
                    return this.$ = i[a - 1]
                  case 13:
                    this.$ = {}, Object.defineProperty(this.$, '__line__', {
                      value: this._$.first_line,
                      enumerable: !1
                    })
                    break
                  case 14:
                  case 19:
                    this.$ = i[a - 1], Object.defineProperty(this.$, '__line__', {
                      value: this._$.first_line,
                      enumerable: !1
                    })
                    break
                  case 15:
                    this.$ = [i[a - 2], i[a]]
                    break
                  case 16:
                    this.$ = {}, this.$[i[a][0]] = i[a][1]
                    break
                  case 17:
                    this.$ = i[a - 2], void 0 !== i[a - 2][i[a][0]] && (this.$.__duplicateProperties__ || Object.defineProperty(this.$, '__duplicateProperties__', {
                      value: [],
                      enumerable: !1
                    }), this.$.__duplicateProperties__.push(i[a][0])), i[a - 2][i[a][0]] = i[a][1]
                    break
                  case 18:
                    this.$ = [], Object.defineProperty(this.$, '__line__', {
                      value: this._$.first_line,
                      enumerable: !1
                    })
                    break
                  case 20:
                    this.$ = [i[a]]
                    break
                  case 21:
                    this.$ = i[a - 2], i[a - 2].push(i[a])
                }
              },
              table: [{
                3: 5,
                4: t,
                5: 6,
                6: n,
                7: 3,
                8: o,
                9: 4,
                10: r,
                11: i,
                12: 1,
                13: 2,
                15: 7,
                16: 8,
                17: s,
                23: a
              }, { 1: [3] }, { 14: [1, 16] }, e(c, [2, 7]), e(c, [2, 8]), e(c, [2, 9]), e(c, [2, 10]), e(c, [2, 11]), e(c, [2, 12]), e(c, [2, 3]), e(c, [2, 4]), e(c, [2, 5]), e([14, 18, 21, 22, 24], [2, 1]), e(c, [2, 2]), {
                3: 20,
                4: t,
                18: [1, 17],
                19: 18,
                20: 19
              }, {
                3: 5,
                4: t,
                5: 6,
                6: n,
                7: 3,
                8: o,
                9: 4,
                10: r,
                11: i,
                13: 23,
                15: 7,
                16: 8,
                17: s,
                23: a,
                24: [1, 21],
                25: 22
              }, { 1: [2, 6] }, e(c, [2, 13]), {
                18: [1, 24],
                22: [1, 25]
              }, e(u, [2, 16]), { 21: [1, 26] }, e(c, [2, 18]), {
                22: [1, 28],
                24: [1, 27]
              }, e(l, [2, 20]), e(c, [2, 14]), { 3: 20, 4: t, 20: 29 }, {
                3: 5,
                4: t,
                5: 6,
                6: n,
                7: 3,
                8: o,
                9: 4,
                10: r,
                11: i,
                13: 30,
                15: 7,
                16: 8,
                17: s,
                23: a
              }, e(c, [2, 19]), {
                3: 5,
                4: t,
                5: 6,
                6: n,
                7: 3,
                8: o,
                9: 4,
                10: r,
                11: i,
                13: 31,
                15: 7,
                16: 8,
                17: s,
                23: a
              }, e(u, [2, 17]), e(u, [2, 15]), e(l, [2, 21])],
              defaultActions: { 16: [2, 6] },
              parseError: function (e, t) {
                if (!t.recoverable) {
                  function n (e, t) {
                    this.message = e, this.hash = t
                  }

                  throw n.prototype = Error, new n(e, t)
                }
                this.trace(e)
              },
              parse: function (e) {
                var t = this, n = [0], o = [null], r = [], i = this.table, s = '', a = 0, c = 0, u = 0,
                  l = r.slice.call(arguments, 1), p = Object.create(this.lexer), f = { yy: {} }
                for (var h in this.yy) Object.prototype.hasOwnProperty.call(this.yy, h) && (f.yy[h] = this.yy[h])
                p.setInput(e, f.yy), f.yy.lexer = p, f.yy.parser = this, void 0 === p.yylloc && (p.yylloc = {})
                var d = p.yylloc
                r.push(d)
                var g = p.options && p.options.ranges
                'function' == typeof f.yy.parseError ? this.parseError = f.yy.parseError : this.parseError = Object.getPrototypeOf(this).parseError
                for (var y, m, _, v, b, E, T, x, S, O = function () {
                  var e
                  return 'number' != typeof (e = p.lex() || 1) && (e = t.symbols_[e] || e), e
                }, I = {}; ;) {
                  if (_ = n[n.length - 1], this.defaultActions[_] ? v = this.defaultActions[_] : (null !== y && void 0 !== y || (y = O()), v = i[_] && i[_][y]), void 0 === v || !v.length || !v[0]) {
                    var C = ''
                    for (E in S = [], i[_]) this.terminals_[E] && E > 2 && S.push('\'' + this.terminals_[E] + '\'')
                    C = p.showPosition ? 'Parse error on line ' + (a + 1) + ':\n' + p.showPosition() + '\nExpecting ' + S.join(', ') + ', got \'' + (this.terminals_[y] || y) + '\'' : 'Parse error on line ' + (a + 1) + ': Unexpected ' + (1 == y ? 'end of input' : '\'' + (this.terminals_[y] || y) + '\''), this.parseError(C, {
                      text: p.match,
                      token: this.terminals_[y] || y,
                      line: p.yylineno,
                      loc: d,
                      expected: S
                    })
                  }
                  if (v[0] instanceof Array && v.length > 1) throw new Error('Parse Error: multiple actions possible at state: ' + _ + ', token: ' + y)
                  switch (v[0]) {
                    case 1:
                      n.push(y), o.push(p.yytext), r.push(p.yylloc), n.push(v[1]), y = null, m ? (y = m, m = null) : (c = p.yyleng, s = p.yytext, a = p.yylineno, d = p.yylloc, u > 0 && u--)
                      break
                    case 2:
                      if (T = this.productions_[v[1]][1], I.$ = o[o.length - T], I._$ = {
                        first_line: r[r.length - (T || 1)].first_line,
                        last_line: r[r.length - 1].last_line,
                        first_column: r[r.length - (T || 1)].first_column,
                        last_column: r[r.length - 1].last_column
                      }, g && (I._$.range = [r[r.length - (T || 1)].range[0], r[r.length - 1].range[1]]), void 0 !== (b = this.performAction.apply(I, [s, c, a, f.yy, v[1], o, r].concat(l)))) return b
                      T && (n = n.slice(0, -1 * T * 2), o = o.slice(0, -1 * T), r = r.slice(0, -1 * T)), n.push(this.productions_[v[1]][0]), o.push(I.$), r.push(I._$), x = i[n[n.length - 2]][n[n.length - 1]], n.push(x)
                      break
                    case 3:
                      return !0
                  }
                }
                return !0
              }
            }, f = {
              EOF: 1,
              parseError: function (e, t) {
                if (!this.yy.parser) throw new Error(e)
                this.yy.parser.parseError(e, t)
              },
              setInput: function (e, t) {
                return this.yy = t || this.yy || {}, this._input = e, this._more = this._backtrack = this.done = !1, this.yylineno = this.yyleng = 0, this.yytext = this.matched = this.match = '', this.conditionStack = ['INITIAL'], this.yylloc = {
                  first_line: 1,
                  first_column: 0,
                  last_line: 1,
                  last_column: 0
                }, this.options.ranges && (this.yylloc.range = [0, 0]), this.offset = 0, this
              },
              input: function () {
                var e = this._input[0]
                return this.yytext += e, this.yyleng++, this.offset++, this.match += e, this.matched += e, e.match(/(?:\r\n?|\n).*/g) ? (this.yylineno++, this.yylloc.last_line++) : this.yylloc.last_column++, this.options.ranges && this.yylloc.range[1]++, this._input = this._input.slice(1), e
              },
              unput: function (e) {
                var t = e.length, n = e.split(/(?:\r\n?|\n)/g)
                this._input = e + this._input, this.yytext = this.yytext.substr(0, this.yytext.length - t), this.offset -= t
                var o = this.match.split(/(?:\r\n?|\n)/g)
                this.match = this.match.substr(0, this.match.length - 1), this.matched = this.matched.substr(0, this.matched.length - 1), n.length - 1 && (this.yylineno -= n.length - 1)
                var r = this.yylloc.range
                return this.yylloc = {
                  first_line: this.yylloc.first_line,
                  last_line: this.yylineno + 1,
                  first_column: this.yylloc.first_column,
                  last_column: n ? (n.length === o.length ? this.yylloc.first_column : 0) + o[o.length - n.length].length - n[0].length : this.yylloc.first_column - t
                }, this.options.ranges && (this.yylloc.range = [r[0], r[0] + this.yyleng - t]), this.yyleng = this.yytext.length, this
              },
              more: function () {
                return this._more = !0, this
              },
              reject: function () {
                return this.options.backtrack_lexer ? (this._backtrack = !0, this) : this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                  text: '',
                  token: null,
                  line: this.yylineno
                })
              },
              less: function (e) {
                this.unput(this.match.slice(e))
              },
              pastInput: function () {
                var e = this.matched.substr(0, this.matched.length - this.match.length)
                return (e.length > 20 ? '...' : '') + e.substr(-20).replace(/\n/g, '')
              },
              upcomingInput: function () {
                var e = this.match
                return e.length < 20 && (e += this._input.substr(0, 20 - e.length)), (e.substr(0, 20) + (e.length > 20 ? '...' : '')).replace(/\n/g, '')
              },
              showPosition: function () {
                var e = this.pastInput(), t = new Array(e.length + 1).join('-')
                return e + this.upcomingInput() + '\n' + t + '^'
              },
              test_match: function (e, t) {
                var n, o, r
                if (this.options.backtrack_lexer && (r = {
                  yylineno: this.yylineno,
                  yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                  },
                  yytext: this.yytext,
                  match: this.match,
                  matches: this.matches,
                  matched: this.matched,
                  yyleng: this.yyleng,
                  offset: this.offset,
                  _more: this._more,
                  _input: this._input,
                  yy: this.yy,
                  conditionStack: this.conditionStack.slice(0),
                  done: this.done
                }, this.options.ranges && (r.yylloc.range = this.yylloc.range.slice(0))), (o = e[0].match(/(?:\r\n?|\n).*/g)) && (this.yylineno += o.length), this.yylloc = {
                  first_line: this.yylloc.last_line,
                  last_line: this.yylineno + 1,
                  first_column: this.yylloc.last_column,
                  last_column: o ? o[o.length - 1].length - o[o.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + e[0].length
                }, this.yytext += e[0], this.match += e[0], this.matches = e, this.yyleng = this.yytext.length, this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]), this._more = !1, this._backtrack = !1, this._input = this._input.slice(e[0].length), this.matched += e[0], n = this.performAction.call(this, this.yy, this, t, this.conditionStack[this.conditionStack.length - 1]), this.done && this._input && (this.done = !1), n) return n
                if (this._backtrack) {
                  for (var i in r) this[i] = r[i]
                  return !1
                }
                return !1
              },
              next: function () {
                if (this.done) return this.EOF
                var e, t, n, o
                this._input || (this.done = !0), this._more || (this.yytext = '', this.match = '')
                for (var r = this._currentRules(), i = 0; i < r.length; i++) if ((n = this._input.match(this.rules[r[i]])) && (!t || n[0].length > t[0].length)) {
                  if (t = n, o = i, this.options.backtrack_lexer) {
                    if (!1 !== (e = this.test_match(n, r[i]))) return e
                    if (this._backtrack) {
                      t = !1
                      continue
                    }
                    return !1
                  }
                  if (!this.options.flex) break
                }
                return t ? !1 !== (e = this.test_match(t, r[o])) && e : '' === this._input ? this.EOF : this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                  text: '',
                  token: null,
                  line: this.yylineno
                })
              },
              lex: function () {
                var e = this.next()
                return e || this.lex()
              },
              begin: function (e) {
                this.conditionStack.push(e)
              },
              popState: function () {
                return this.conditionStack.length - 1 > 0 ? this.conditionStack.pop() : this.conditionStack[0]
              },
              _currentRules: function () {
                return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1] ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules : this.conditions.INITIAL.rules
              },
              topState: function (e) {
                return (e = this.conditionStack.length - 1 - Math.abs(e || 0)) >= 0 ? this.conditionStack[e] : 'INITIAL'
              },
              pushState: function (e) {
                this.begin(e)
              },
              stateStackSize: function () {
                return this.conditionStack.length
              },
              options: {},
              performAction: function (e, t, n, o) {
                switch (n) {
                  case 0:
                    break
                  case 1:
                    return 6
                  case 2:
                    return t.yytext = t.yytext.substr(1, t.yyleng - 2), 4
                  case 3:
                    return 17
                  case 4:
                    return 18
                  case 5:
                    return 23
                  case 6:
                    return 24
                  case 7:
                    return 22
                  case 8:
                    return 21
                  case 9:
                    return 10
                  case 10:
                    return 11
                  case 11:
                    return 8
                  case 12:
                    return 14
                  case 13:
                    return 'INVALID'
                }
              },
              rules: [/^(?:\s+)/, /^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/, /^(?:"(?:\\[\\"bfnrt\/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/, /^(?:\{)/, /^(?:\})/, /^(?:\[)/, /^(?:\])/, /^(?:,)/, /^(?::)/, /^(?:true\b)/, /^(?:false\b)/, /^(?:null\b)/, /^(?:$)/, /^(?:.)/],
              conditions: { INITIAL: { rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], inclusive: !0 } }
            }

          function h () {
            this.yy = {}
          }

          return p.lexer = f, h.prototype = p, p.Parser = h, new h
        }()
        void 0 !== e && void 0 !== n && (n.parser = r, n.Parser = r.Parser, n.parse = function () {
          return r.parse.apply(r, arguments)
        }, n.main = function (t) {
          t[1] || (console.log('Usage: ' + t[0] + ' FILE'), o.exit(1))
          var r = e('fs').readFileSync(e('path').normalize(t[1]), 'utf8')
          return n.parser.parse(r)
        }, void 0 !== t && e.main === t && n.main(o.argv.slice(1)))
      }).call(this, e('_process'))
    }, { _process: 18, fs: 12, path: 17 }],
    16: [function (e, t, n) {
      (function (e) {
        var o = 200, r = '__lodash_hash_undefined__', i = 1, s = 2, a = 9007199254740991,
          c = '[object Arguments]', u = '[object Array]', l = '[object AsyncFunction]',
          p = '[object Boolean]', f = '[object Date]', h = '[object Error]', d = '[object Function]',
          g = '[object GeneratorFunction]', y = '[object Map]', m = '[object Number]', _ = '[object Null]',
          v = '[object Object]', b = '[object Proxy]', E = '[object RegExp]', T = '[object Set]',
          x = '[object String]', S = '[object Symbol]', O = '[object Undefined]', I = '[object ArrayBuffer]',
          C = '[object DataView]', L = /^\[object .+?Constructor\]$/, M = /^(?:0|[1-9]\d*)$/, N = {}
        N['[object Float32Array]'] = N['[object Float64Array]'] = N['[object Int8Array]'] = N['[object Int16Array]'] = N['[object Int32Array]'] = N['[object Uint8Array]'] = N['[object Uint8ClampedArray]'] = N['[object Uint16Array]'] = N['[object Uint32Array]'] = !0, N[c] = N[u] = N[I] = N[p] = N[C] = N[f] = N[h] = N[d] = N[y] = N[m] = N[v] = N[E] = N[T] = N[x] = N['[object WeakMap]'] = !1
        var w = 'object' == typeof e && e && e.Object === Object && e,
          A = 'object' == typeof self && self && self.Object === Object && self,
          P = w || A || Function('return this')(), F = 'object' == typeof n && n && !n.nodeType && n,
          j = F && 'object' == typeof t && t && !t.nodeType && t, k = j && j.exports === F,
          R = k && w.process, D = function () {
            try {
              return R && R.binding && R.binding('util')
            } catch (e) {
            }
          }(), U = D && D.isTypedArray

        function V (e, t) {
          for (var n = -1, o = null == e ? 0 : e.length; ++n < o;) if (t(e[n], n, e)) return !0
          return !1
        }

        function G (e) {
          var t = -1, n = Array(e.size)
          return e.forEach(function (e, o) {
            n[++t] = [o, e]
          }), n
        }

        function B (e) {
          var t = -1, n = Array(e.size)
          return e.forEach(function (e) {
            n[++t] = e
          }), n
        }

        var $, J, z, q = Array.prototype, Y = Function.prototype, X = Object.prototype,
          W = P['__core-js_shared__'], K = Y.toString, H = X.hasOwnProperty,
          Z = ($ = /[^.]+$/.exec(W && W.keys && W.keys.IE_PROTO || '')) ? 'Symbol(src)_1.' + $ : '',
          Q = X.toString,
          ee = RegExp('^' + K.call(H).replace(/[\\^$.*+?()[\]{}|]/g, '\\$&').replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'),
          te = k ? P.Buffer : void 0, ne = P.Symbol, oe = P.Uint8Array, re = X.propertyIsEnumerable,
          ie = q.splice, se = ne ? ne.toStringTag : void 0, ae = Object.getOwnPropertySymbols,
          ce = te ? te.isBuffer : void 0, ue = (J = Object.keys, z = Object, function (e) {
            return J(z(e))
          }), le = De(P, 'DataView'), pe = De(P, 'Map'), fe = De(P, 'Promise'), he = De(P, 'Set'),
          de = De(P, 'WeakMap'), ge = De(Object, 'create'), ye = Be(le), me = Be(pe), _e = Be(fe),
          ve = Be(he), be = Be(de), Ee = ne ? ne.prototype : void 0, Te = Ee ? Ee.valueOf : void 0

        function xe (e) {
          var t = -1, n = null == e ? 0 : e.length
          for (this.clear(); ++t < n;) {
            var o = e[t]
            this.set(o[0], o[1])
          }
        }

        function Se (e) {
          var t = -1, n = null == e ? 0 : e.length
          for (this.clear(); ++t < n;) {
            var o = e[t]
            this.set(o[0], o[1])
          }
        }

        function Oe (e) {
          var t = -1, n = null == e ? 0 : e.length
          for (this.clear(); ++t < n;) {
            var o = e[t]
            this.set(o[0], o[1])
          }
        }

        function Ie (e) {
          var t = -1, n = null == e ? 0 : e.length
          for (this.__data__ = new Oe; ++t < n;) this.add(e[t])
        }

        function Ce (e) {
          var t = this.__data__ = new Se(e)
          this.size = t.size
        }

        function Le (e, t) {
          var n = ze(e), o = !n && Je(e), r = !n && !o && qe(e), i = !n && !o && !r && He(e),
            s = n || o || r || i, a = s ? function (e, t) {
              for (var n = -1, o = Array(e); ++n < e;) o[n] = t(n)
              return o
            }(e.length, String) : [], c = a.length
          for (var u in e) !t && !H.call(e, u) || s && ('length' == u || r && ('offset' == u || 'parent' == u) || i && ('buffer' == u || 'byteLength' == u || 'byteOffset' == u) || Ge(u, c)) || a.push(u)
          return a
        }

        function Me (e, t) {
          for (var n = e.length; n--;) if ($e(e[n][0], t)) return n
          return -1
        }

        function Ne (e) {
          return null == e ? void 0 === e ? O : _ : se && se in Object(e) ? function (e) {
            var t = H.call(e, se), n = e[se]
            try {
              e[se] = void 0
              var o = !0
            } catch (e) {
            }
            var r = Q.call(e)
            o && (t ? e[se] = n : delete e[se])
            return r
          }(e) : function (e) {
            return Q.call(e)
          }(e)
        }

        function we (e) {
          return Ke(e) && Ne(e) == c
        }

        function Ae (e, t, n, o, r) {
          return e === t || (null == e || null == t || !Ke(e) && !Ke(t) ? e != e && t != t : function (e, t, n, o, r, a) {
            var l = ze(e), d = ze(t), g = l ? u : Ve(e), _ = d ? u : Ve(t), b = (g = g == c ? v : g) == v,
              O = (_ = _ == c ? v : _) == v, L = g == _
            if (L && qe(e)) {
              if (!qe(t)) return !1
              l = !0, b = !1
            }
            if (L && !b) return a || (a = new Ce), l || He(e) ? je(e, t, n, o, r, a) : function (e, t, n, o, r, a, c) {
              switch (n) {
                case C:
                  if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1
                  e = e.buffer, t = t.buffer
                case I:
                  return !(e.byteLength != t.byteLength || !a(new oe(e), new oe(t)))
                case p:
                case f:
                case m:
                  return $e(+e, +t)
                case h:
                  return e.name == t.name && e.message == t.message
                case E:
                case x:
                  return e == t + ''
                case y:
                  var u = G
                case T:
                  var l = o & i
                  if (u || (u = B), e.size != t.size && !l) return !1
                  var d = c.get(e)
                  if (d) return d == t
                  o |= s, c.set(e, t)
                  var g = je(u(e), u(t), o, r, a, c)
                  return c.delete(e), g
                case S:
                  if (Te) return Te.call(e) == Te.call(t)
              }
              return !1
            }(e, t, g, n, o, r, a)
            if (!(n & i)) {
              var M = b && H.call(e, '__wrapped__'), N = O && H.call(t, '__wrapped__')
              if (M || N) {
                var w = M ? e.value() : e, A = N ? t.value() : t
                return a || (a = new Ce), r(w, A, n, o, a)
              }
            }
            if (!L) return !1
            return a || (a = new Ce), function (e, t, n, o, r, s) {
              var a = n & i, c = ke(e), u = c.length, l = ke(t).length
              if (u != l && !a) return !1
              for (var p = u; p--;) {
                var f = c[p]
                if (!(a ? f in t : H.call(t, f))) return !1
              }
              var h = s.get(e)
              if (h && s.get(t)) return h == t
              var d = !0
              s.set(e, t), s.set(t, e)
              for (var g = a; ++p < u;) {
                f = c[p]
                var y = e[f], m = t[f]
                if (o) var _ = a ? o(m, y, f, t, e, s) : o(y, m, f, e, t, s)
                if (!(void 0 === _ ? y === m || r(y, m, n, o, s) : _)) {
                  d = !1
                  break
                }
                g || (g = 'constructor' == f)
              }
              if (d && !g) {
                var v = e.constructor, b = t.constructor
                v != b && 'constructor' in e && 'constructor' in t && !('function' == typeof v && v instanceof v && 'function' == typeof b && b instanceof b) && (d = !1)
              }
              return s.delete(e), s.delete(t), d
            }(e, t, n, o, r, a)
          }(e, t, n, o, Ae, r))
        }

        function Pe (e) {
          return !(!We(e) || Z && Z in e) && (Ye(e) ? ee : L).test(Be(e))
        }

        function Fe (e) {
          if (n = (t = e) && t.constructor, o = 'function' == typeof n && n.prototype || X, t !== o) return ue(e)
          var t, n, o, r = []
          for (var i in Object(e)) H.call(e, i) && 'constructor' != i && r.push(i)
          return r
        }

        function je (e, t, n, o, r, a) {
          var c = n & i, u = e.length, l = t.length
          if (u != l && !(c && l > u)) return !1
          var p = a.get(e)
          if (p && a.get(t)) return p == t
          var f = -1, h = !0, d = n & s ? new Ie : void 0
          for (a.set(e, t), a.set(t, e); ++f < u;) {
            var g = e[f], y = t[f]
            if (o) var m = c ? o(y, g, f, t, e, a) : o(g, y, f, e, t, a)
            if (void 0 !== m) {
              if (m) continue
              h = !1
              break
            }
            if (d) {
              if (!V(t, function (e, t) {
                if (i = t, !d.has(i) && (g === e || r(g, e, n, o, a))) return d.push(t)
                var i
              })) {
                h = !1
                break
              }
            } else if (g !== y && !r(g, y, n, o, a)) {
              h = !1
              break
            }
          }
          return a.delete(e), a.delete(t), h
        }

        function ke (e) {
          return function (e, t, n) {
            var o = t(e)
            return ze(e) ? o : function (e, t) {
              for (var n = -1, o = t.length, r = e.length; ++n < o;) e[r + n] = t[n]
              return e
            }(o, n(e))
          }(e, Ze, Ue)
        }

        function Re (e, t) {
          var n, o, r = e.__data__
          return ('string' == (o = typeof (n = t)) || 'number' == o || 'symbol' == o || 'boolean' == o ? '__proto__' !== n : null === n) ? r['string' == typeof t ? 'string' : 'hash'] : r.map
        }

        function De (e, t) {
          var n = function (e, t) {
            return null == e ? void 0 : e[t]
          }(e, t)
          return Pe(n) ? n : void 0
        }

        xe.prototype.clear = function () {
          this.__data__ = ge ? ge(null) : {}, this.size = 0
        }, xe.prototype.delete = function (e) {
          var t = this.has(e) && delete this.__data__[e]
          return this.size -= t ? 1 : 0, t
        }, xe.prototype.get = function (e) {
          var t = this.__data__
          if (ge) {
            var n = t[e]
            return n === r ? void 0 : n
          }
          return H.call(t, e) ? t[e] : void 0
        }, xe.prototype.has = function (e) {
          var t = this.__data__
          return ge ? void 0 !== t[e] : H.call(t, e)
        }, xe.prototype.set = function (e, t) {
          var n = this.__data__
          return this.size += this.has(e) ? 0 : 1, n[e] = ge && void 0 === t ? r : t, this
        }, Se.prototype.clear = function () {
          this.__data__ = [], this.size = 0
        }, Se.prototype.delete = function (e) {
          var t = this.__data__, n = Me(t, e)
          return !(n < 0 || (n == t.length - 1 ? t.pop() : ie.call(t, n, 1), --this.size, 0))
        }, Se.prototype.get = function (e) {
          var t = this.__data__, n = Me(t, e)
          return n < 0 ? void 0 : t[n][1]
        }, Se.prototype.has = function (e) {
          return Me(this.__data__, e) > -1
        }, Se.prototype.set = function (e, t) {
          var n = this.__data__, o = Me(n, e)
          return o < 0 ? (++this.size, n.push([e, t])) : n[o][1] = t, this
        }, Oe.prototype.clear = function () {
          this.size = 0, this.__data__ = { hash: new xe, map: new (pe || Se), string: new xe }
        }, Oe.prototype.delete = function (e) {
          var t = Re(this, e).delete(e)
          return this.size -= t ? 1 : 0, t
        }, Oe.prototype.get = function (e) {
          return Re(this, e).get(e)
        }, Oe.prototype.has = function (e) {
          return Re(this, e).has(e)
        }, Oe.prototype.set = function (e, t) {
          var n = Re(this, e), o = n.size
          return n.set(e, t), this.size += n.size == o ? 0 : 1, this
        }, Ie.prototype.add = Ie.prototype.push = function (e) {
          return this.__data__.set(e, r), this
        }, Ie.prototype.has = function (e) {
          return this.__data__.has(e)
        }, Ce.prototype.clear = function () {
          this.__data__ = new Se, this.size = 0
        }, Ce.prototype.delete = function (e) {
          var t = this.__data__, n = t.delete(e)
          return this.size = t.size, n
        }, Ce.prototype.get = function (e) {
          return this.__data__.get(e)
        }, Ce.prototype.has = function (e) {
          return this.__data__.has(e)
        }, Ce.prototype.set = function (e, t) {
          var n = this.__data__
          if (n instanceof Se) {
            var r = n.__data__
            if (!pe || r.length < o - 1) return r.push([e, t]), this.size = ++n.size, this
            n = this.__data__ = new Oe(r)
          }
          return n.set(e, t), this.size = n.size, this
        }
        var Ue = ae ? function (e) {
          return null == e ? [] : (e = Object(e), function (e, t) {
            for (var n = -1, o = null == e ? 0 : e.length, r = 0, i = []; ++n < o;) {
              var s = e[n]
              t(s, n, e) && (i[r++] = s)
            }
            return i
          }(ae(e), function (t) {
            return re.call(e, t)
          }))
        } : function () {
          return []
        }, Ve = Ne

        function Ge (e, t) {
          return !!(t = null == t ? a : t) && ('number' == typeof e || M.test(e)) && e > -1 && e % 1 == 0 && e < t
        }

        function Be (e) {
          if (null != e) {
            try {
              return K.call(e)
            } catch (e) {
            }
            try {
              return e + ''
            } catch (e) {
            }
          }
          return ''
        }

        function $e (e, t) {
          return e === t || e != e && t != t
        }

        (le && Ve(new le(new ArrayBuffer(1))) != C || pe && Ve(new pe) != y || fe && '[object Promise]' != Ve(fe.resolve()) || he && Ve(new he) != T || de && '[object WeakMap]' != Ve(new de)) && (Ve = function (e) {
          var t = Ne(e), n = t == v ? e.constructor : void 0, o = n ? Be(n) : ''
          if (o) switch (o) {
            case ye:
              return C
            case me:
              return y
            case _e:
              return '[object Promise]'
            case ve:
              return T
            case be:
              return '[object WeakMap]'
          }
          return t
        })
        var Je = we(function () {
          return arguments
        }()) ? we : function (e) {
          return Ke(e) && H.call(e, 'callee') && !re.call(e, 'callee')
        }, ze = Array.isArray
        var qe = ce || function () {
          return !1
        }

        function Ye (e) {
          if (!We(e)) return !1
          var t = Ne(e)
          return t == d || t == g || t == l || t == b
        }

        function Xe (e) {
          return 'number' == typeof e && e > -1 && e % 1 == 0 && e <= a
        }

        function We (e) {
          var t = typeof e
          return null != e && ('object' == t || 'function' == t)
        }

        function Ke (e) {
          return null != e && 'object' == typeof e
        }

        var He = U ? function (e) {
          return function (t) {
            return e(t)
          }
        }(U) : function (e) {
          return Ke(e) && Xe(e.length) && !!N[Ne(e)]
        }

        function Ze (e) {
          return null != (t = e) && Xe(t.length) && !Ye(t) ? Le(e) : Fe(e)
          var t
        }

        t.exports = function (e, t) {
          return Ae(e, t)
        }
      }).call(this, 'undefined' != typeof global ? global : 'undefined' != typeof self ? self : 'undefined' != typeof window ? window : {})
    }, {}],
    17: [function (e, t, n) {
      (function (e) {
        function t (e, t) {
          for (var n = 0, o = e.length - 1; o >= 0; o--) {
            var r = e[o]
            '.' === r ? e.splice(o, 1) : '..' === r ? (e.splice(o, 1), n++) : n && (e.splice(o, 1), n--)
          }
          if (t) for (; n--; n) e.unshift('..')
          return e
        }

        var o = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, r = function (e) {
          return o.exec(e).slice(1)
        }

        function i (e, t) {
          if (e.filter) return e.filter(t)
          for (var n = [], o = 0; o < e.length; o++) t(e[o], o, e) && n.push(e[o])
          return n
        }

        n.resolve = function () {
          for (var n = '', o = !1, r = arguments.length - 1; r >= -1 && !o; r--) {
            var s = r >= 0 ? arguments[r] : e.cwd()
            if ('string' != typeof s) throw new TypeError('Arguments to path.resolve must be strings')
            s && (n = s + '/' + n, o = '/' === s.charAt(0))
          }
          return n = t(i(n.split('/'), function (e) {
            return !!e
          }), !o).join('/'), (o ? '/' : '') + n || '.'
        }, n.normalize = function (e) {
          var o = n.isAbsolute(e), r = '/' === s(e, -1)
          return (e = t(i(e.split('/'), function (e) {
            return !!e
          }), !o).join('/')) || o || (e = '.'), e && r && (e += '/'), (o ? '/' : '') + e
        }, n.isAbsolute = function (e) {
          return '/' === e.charAt(0)
        }, n.join = function () {
          var e = Array.prototype.slice.call(arguments, 0)
          return n.normalize(i(e, function (e, t) {
            if ('string' != typeof e) throw new TypeError('Arguments to path.join must be strings')
            return e
          }).join('/'))
        }, n.relative = function (e, t) {
          function o (e) {
            for (var t = 0; t < e.length && '' === e[t]; t++);
            for (var n = e.length - 1; n >= 0 && '' === e[n]; n--);
            return t > n ? [] : e.slice(t, n - t + 1)
          }

          e = n.resolve(e).substr(1), t = n.resolve(t).substr(1)
          for (var r = o(e.split('/')), i = o(t.split('/')), s = Math.min(r.length, i.length), a = s, c = 0; c < s; c++) if (r[c] !== i[c]) {
            a = c
            break
          }
          var u = []
          for (c = a; c < r.length; c++) u.push('..')
          return (u = u.concat(i.slice(a))).join('/')
        }, n.sep = '/', n.delimiter = ':', n.dirname = function (e) {
          var t = r(e), n = t[0], o = t[1]
          return n || o ? (o && (o = o.substr(0, o.length - 1)), n + o) : '.'
        }, n.basename = function (e, t) {
          var n = r(e)[2]
          return t && n.substr(-1 * t.length) === t && (n = n.substr(0, n.length - t.length)), n
        }, n.extname = function (e) {
          return r(e)[3]
        }
        var s = 'b' === 'ab'.substr(-1) ? function (e, t, n) {
          return e.substr(t, n)
        } : function (e, t, n) {
          return t < 0 && (t = e.length + t), e.substr(t, n)
        }
      }).call(this, e('_process'))
    }, { _process: 18 }],
    18: [function (e, t, n) {
      var o, r, i = t.exports = {}

      function s () {
        throw new Error('setTimeout has not been defined')
      }

      function a () {
        throw new Error('clearTimeout has not been defined')
      }

      function c (e) {
        if (o === setTimeout) return setTimeout(e, 0)
        if ((o === s || !o) && setTimeout) return o = setTimeout, setTimeout(e, 0)
        try {
          return o(e, 0)
        } catch (t) {
          try {
            return o.call(null, e, 0)
          } catch (t) {
            return o.call(this, e, 0)
          }
        }
      }

      !function () {
        try {
          o = 'function' == typeof setTimeout ? setTimeout : s
        } catch (e) {
          o = s
        }
        try {
          r = 'function' == typeof clearTimeout ? clearTimeout : a
        } catch (e) {
          r = a
        }
      }()
      var u, l = [], p = !1, f = -1

      function h () {
        p && u && (p = !1, u.length ? l = u.concat(l) : f = -1, l.length && d())
      }

      function d () {
        if (!p) {
          var e = c(h)
          p = !0
          for (var t = l.length; t;) {
            for (u = l, l = []; ++f < t;) u && u[f].run()
            f = -1, t = l.length
          }
          u = null, p = !1, function (e) {
            if (r === clearTimeout) return clearTimeout(e)
            if ((r === a || !r) && clearTimeout) return r = clearTimeout, clearTimeout(e)
            try {
              r(e)
            } catch (t) {
              try {
                return r.call(null, e)
              } catch (t) {
                return r.call(this, e)
              }
            }
          }(e)
        }
      }

      function g (e, t) {
        this.fun = e, this.array = t
      }

      function y () {
      }

      i.nextTick = function (e) {
        var t = new Array(arguments.length - 1)
        if (arguments.length > 1) for (var n = 1; n < arguments.length; n++) t[n - 1] = arguments[n]
        l.push(new g(e, t)), 1 !== l.length || p || c(d)
      }, g.prototype.run = function () {
        this.fun.apply(null, this.array)
      }, i.title = 'browser', i.browser = !0, i.env = {}, i.argv = [], i.version = '', i.versions = {}, i.on = y, i.addListener = y, i.once = y, i.off = y, i.removeListener = y, i.removeAllListeners = y, i.emit = y, i.prependListener = y, i.prependOnceListener = y, i.listeners = function (e) {
        return []
      }, i.binding = function (e) {
        throw new Error('process.binding is not supported')
      }, i.cwd = function () {
        return '/'
      }, i.chdir = function (e) {
        throw new Error('process.chdir is not supported')
      }, i.umask = function () {
        return 0
      }
    }, {}],
    19: [function (e, t, n) {
      var o = t.exports = function (e) {
        return new r(e)
      }

      function r (e) {
        this.value = e
      }

      function i (e, t, n) {
        var o = [], r = [], i = !0
        return function e (c) {
          var f = {}, h = !0, d = {
            node: n ? s(c) : c,
            node_: c,
            path: [].concat(o),
            parent: r[r.length - 1],
            parents: r,
            key: o.slice(-1)[0],
            isRoot: 0 === o.length,
            level: o.length,
            circular: null,
            update: function (e, t) {
              d.isRoot || (d.parent.node[d.key] = e), d.node = e, t && (h = !1)
            },
            delete: function (e) {
              delete d.parent.node[d.key], e && (h = !1)
            },
            remove: function (e) {
              u(d.parent.node) ? d.parent.node.splice(d.key, 1) : delete d.parent.node[d.key], e && (h = !1)
            },
            keys: null,
            before: function (e) {
              f.before = e
            },
            after: function (e) {
              f.after = e
            },
            pre: function (e) {
              f.pre = e
            },
            post: function (e) {
              f.post = e
            },
            stop: function () {
              i = !1
            },
            block: function () {
              h = !1
            }
          }
          if (!i) return d

          function g () {
            if ('object' == typeof d.node && null !== d.node) {
              d.keys && d.node_ === d.node || (d.keys = a(d.node)), d.isLeaf = 0 == d.keys.length
              for (var e = 0; e < r.length; e++) if (r[e].node_ === c) {
                d.circular = r[e]
                break
              }
            } else d.isLeaf = !0, d.keys = null
            d.notLeaf = !d.isLeaf, d.notRoot = !d.isRoot
          }

          g()
          var y = t.call(d, d.node)
          return void 0 !== y && d.update && d.update(y), f.before && f.before.call(d, d.node), h ? ('object' != typeof d.node || null === d.node || d.circular || (r.push(d), g(), l(d.keys, function (t, r) {
            o.push(t), f.pre && f.pre.call(d, d.node[t], t)
            var i = e(d.node[t])
            n && p.call(d.node, t) && (d.node[t] = i.node), i.isLast = r == d.keys.length - 1, i.isFirst = 0 == r, f.post && f.post.call(d, i), o.pop()
          }), r.pop()), f.after && f.after.call(d, d.node), d) : d
        }(e).node
      }

      function s (e) {
        if ('object' == typeof e && null !== e) {
          var t
          if (u(e)) t = []; else if ('[object Date]' === c(e)) t = new Date(e.getTime ? e.getTime() : e); else if (function (e) {
            return '[object RegExp]' === c(e)
          }(e)) t = new RegExp(e); else if (function (e) {
            return '[object Error]' === c(e)
          }(e)) t = { message: e.message }; else if (function (e) {
            return '[object Boolean]' === c(e)
          }(e)) t = new Boolean(e); else if (function (e) {
            return '[object Number]' === c(e)
          }(e)) t = new Number(e); else if (function (e) {
            return '[object String]' === c(e)
          }(e)) t = new String(e); else if (Object.create && Object.getPrototypeOf) t = Object.create(Object.getPrototypeOf(e)); else if (e.constructor === Object) t = {}; else {
            var n = e.constructor && e.constructor.prototype || e.__proto__ || {}, o = function () {
            }
            o.prototype = n, t = new o
          }
          return l(a(e), function (n) {
            t[n] = e[n]
          }), t
        }
        return e
      }

      r.prototype.get = function (e) {
        for (var t = this.value, n = 0; n < e.length; n++) {
          var o = e[n]
          if (!t || !p.call(t, o)) {
            t = void 0
            break
          }
          t = t[o]
        }
        return t
      }, r.prototype.has = function (e) {
        for (var t = this.value, n = 0; n < e.length; n++) {
          var o = e[n]
          if (!t || !p.call(t, o)) return !1
          t = t[o]
        }
        return !0
      }, r.prototype.set = function (e, t) {
        for (var n = this.value, o = 0; o < e.length - 1; o++) {
          var r = e[o]
          p.call(n, r) || (n[r] = {}), n = n[r]
        }
        return n[e[o]] = t, t
      }, r.prototype.map = function (e) {
        return i(this.value, e, !0)
      }, r.prototype.forEach = function (e) {
        return this.value = i(this.value, e, !1), this.value
      }, r.prototype.reduce = function (e, t) {
        var n = 1 === arguments.length, o = n ? this.value : t
        return this.forEach(function (t) {
          this.isRoot && n || (o = e.call(this, o, t))
        }), o
      }, r.prototype.paths = function () {
        var e = []
        return this.forEach(function (t) {
          e.push(this.path)
        }), e
      }, r.prototype.nodes = function () {
        var e = []
        return this.forEach(function (t) {
          e.push(this.node)
        }), e
      }, r.prototype.clone = function () {
        var e = [], t = []
        return function n (o) {
          for (var r = 0; r < e.length; r++) if (e[r] === o) return t[r]
          if ('object' == typeof o && null !== o) {
            var i = s(o)
            return e.push(o), t.push(i), l(a(o), function (e) {
              i[e] = n(o[e])
            }), e.pop(), t.pop(), i
          }
          return o
        }(this.value)
      }
      var a = Object.keys || function (e) {
        var t = []
        for (var n in e) t.push(n)
        return t
      }

      function c (e) {
        return Object.prototype.toString.call(e)
      }

      var u = Array.isArray || function (e) {
        return '[object Array]' === Object.prototype.toString.call(e)
      }, l = function (e, t) {
        if (e.forEach) return e.forEach(t)
        for (var n = 0; n < e.length; n++) t(e[n], n, e)
      }
      l(a(r.prototype), function (e) {
        o[e] = function (t) {
          var n = [].slice.call(arguments, 1), o = new r(t)
          return o[e].apply(o, n)
        }
      })
      var p = Object.hasOwnProperty || function (e, t) {
        return t in e
      }
    }, {}],
    20: [function (e, t, n) {
      t.exports.RADIUS = 6378137, t.exports.FLATTENING = 1 / 298.257223563, t.exports.POLAR_RADIUS = 6356752.3142
    }, {}],
    21: [function (e, t, n) {
      t.exports = function () {
        for (var e = {}, t = 0; t < arguments.length; t++) {
          var n = arguments[t]
          for (var r in n) o.call(n, r) && (e[r] = n[r])
        }
        return e
      }
      var o = Object.prototype.hasOwnProperty
    }, {}],
    22: [function (e, t, n) {
      'use strict'
      var o = e('lodash.isequal'), r = e('@mapbox/geojson-normalize'), i = e('hat'), s = e('./lib/features_at'),
        a = e('./lib/string_sets_are_equal'), c = e('@mapbox/geojsonhint'), u = e('./constants'),
        l = e('./lib/string_set'), p = {
          Polygon: e('./feature_types/polygon'),
          LineString: e('./feature_types/line_string'),
          Point: e('./feature_types/point'),
          MultiPolygon: e('./feature_types/multi_feature'),
          MultiLineString: e('./feature_types/multi_feature'),
          MultiPoint: e('./feature_types/multi_feature')
        }
      t.exports = function (e, t) {
        return t.modes = u.modes, t.getFeatureIdsAt = function (t) {
          return s.click({ point: t }, null, e).map(function (e) {
            return e.properties.id
          })
        }, t.getSelectedIds = function () {
          return e.store.getSelectedIds()
        }, t.getSelected = function () {
          return {
            type: u.geojsonTypes.FEATURE_COLLECTION,
            features: e.store.getSelectedIds().map(function (t) {
              return e.store.get(t)
            }).map(function (e) {
              return e.toGeoJSON()
            })
          }
        }, t.getSelectedPoints = function () {
          return {
            type: u.geojsonTypes.FEATURE_COLLECTION,
            features: e.store.getSelectedCoordinates().map(function (e) {
              return {
                type: u.geojsonTypes.FEATURE,
                properties: {},
                geometry: { type: u.geojsonTypes.POINT, coordinates: e.coordinates }
              }
            })
          }
        }, t.set = function (n) {
          if (void 0 === n.type || n.type !== u.geojsonTypes.FEATURE_COLLECTION || !Array.isArray(n.features)) throw new Error('Invalid FeatureCollection')
          var o = e.store.createRenderBatch(), r = e.store.getAllIds().slice(), i = t.add(n), s = new l(i)
          return (r = r.filter(function (e) {
            return !s.has(e)
          })).length && t.delete(r), o(), i
        }, t.add = function (t) {
          var n = c.hint(t, { precisionWarning: !1 }).filter(function (e) {
            return 'message' !== e.level
          })
          if (n.length) throw new Error(n[0].message)
          var s = JSON.parse(JSON.stringify(r(t))).features.map(function (t) {
            if (t.id = t.id || i(), null === t.geometry) throw new Error('Invalid geometry: null')
            if (void 0 === e.store.get(t.id) || e.store.get(t.id).type !== t.geometry.type) {
              var n = p[t.geometry.type]
              if (void 0 === n) throw new Error('Invalid geometry type: ' + t.geometry.type + '.')
              var r = new n(e, t)
              e.store.add(r)
            } else {
              var s = e.store.get(t.id)
              s.properties = t.properties, o(s.getCoordinates(), t.geometry.coordinates) || s.incomingCoords(t.geometry.coordinates)
            }
            return t.id
          })
          return e.store.render(), s
        }, t.get = function (t) {
          var n = e.store.get(t)
          if (n) return n.toGeoJSON()
        }, t.getAll = function () {
          return {
            type: u.geojsonTypes.FEATURE_COLLECTION, features: e.store.getAll().map(function (e) {
              return e.toGeoJSON()
            })
          }
        }, t.delete = function (n) {
          return e.store.delete(n, { silent: !0 }), t.getMode() !== u.modes.DIRECT_SELECT || e.store.getSelectedIds().length ? e.store.render() : e.events.changeMode(u.modes.SIMPLE_SELECT, void 0, { silent: !0 }), t
        }, t.deleteAll = function () {
          return e.store.delete(e.store.getAllIds(), { silent: !0 }), t.getMode() === u.modes.DIRECT_SELECT ? e.events.changeMode(u.modes.SIMPLE_SELECT, void 0, { silent: !0 }) : e.store.render(), t
        }, t.changeMode = function (n) {
          var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
          return n === u.modes.SIMPLE_SELECT && t.getMode() === u.modes.SIMPLE_SELECT ? a(o.featureIds || [], e.store.getSelectedIds()) ? t : (e.store.setSelected(o.featureIds, { silent: !0 }), e.store.render(), t) : n === u.modes.DIRECT_SELECT && t.getMode() === u.modes.DIRECT_SELECT && o.featureId === e.store.getSelectedIds()[0] ? t : (e.events.changeMode(n, o, { silent: !0 }), t)
        }, t.getMode = function () {
          return e.events.getMode()
        }, t.trash = function () {
          return e.events.trash({ silent: !0 }), t
        }, t.combineFeatures = function () {
          return e.events.combineFeatures({ silent: !0 }), t
        }, t.uncombineFeatures = function () {
          return e.events.uncombineFeatures({ silent: !0 }), t
        }, t.setFeatureProperty = function (n, o, r) {
          return e.store.setFeatureProperty(n, o, r), t
        }, t
      }
    }, {
      './constants': 23,
      './feature_types/line_string': 26,
      './feature_types/multi_feature': 27,
      './feature_types/point': 28,
      './feature_types/polygon': 29,
      './lib/features_at': 37,
      './lib/string_set': 47,
      './lib/string_sets_are_equal': 48,
      '@mapbox/geojson-normalize': 7,
      '@mapbox/geojsonhint': 8,
      hat: 14,
      'lodash.isequal': 16
    }],
    23: [function (e, t, n) {
      'use strict'
      t.exports = {
        classes: {
          CONTROL_BASE: 'mapboxgl-ctrl',
          CONTROL_PREFIX: 'mapboxgl-ctrl-',
          CONTROL_BUTTON: 'mapbox-gl-draw_ctrl-draw-btn',
          CONTROL_BUTTON_LINE: 'mapbox-gl-draw_line',
          CONTROL_BUTTON_POLYGON: 'mapbox-gl-draw_polygon',
          CONTROL_BUTTON_POINT: 'mapbox-gl-draw_point',
          CONTROL_BUTTON_TRASH: 'mapbox-gl-draw_trash',
          CONTROL_BUTTON_COMBINE_FEATURES: 'mapbox-gl-draw_combine',
          CONTROL_BUTTON_UNCOMBINE_FEATURES: 'mapbox-gl-draw_uncombine',
          CONTROL_GROUP: 'mapboxgl-ctrl-group',
          ATTRIBUTION: 'mapboxgl-ctrl-attrib',
          ACTIVE_BUTTON: 'active',
          BOX_SELECT: 'mapbox-gl-draw_boxselect'
        },
        sources: { HOT: 'mapbox-gl-draw-hot', COLD: 'mapbox-gl-draw-cold' },
        cursors: { ADD: 'add', MOVE: 'move', DRAG: 'drag', POINTER: 'pointer', NONE: 'none' },
        types: { POLYGON: 'polygon', LINE: 'line_string', POINT: 'point' },
        geojsonTypes: {
          FEATURE: 'Feature',
          POLYGON: 'Polygon',
          LINE_STRING: 'LineString',
          POINT: 'Point',
          FEATURE_COLLECTION: 'FeatureCollection',
          MULTI_PREFIX: 'Multi',
          MULTI_POINT: 'MultiPoint',
          MULTI_LINE_STRING: 'MultiLineString',
          MULTI_POLYGON: 'MultiPolygon'
        },
        modes: {
          DRAW_LINE_STRING: 'draw_line_string',
          DRAW_POLYGON: 'draw_polygon',
          DRAW_POINT: 'draw_point',
          SIMPLE_SELECT: 'simple_select',
          DIRECT_SELECT: 'direct_select',
          STATIC: 'static'
        },
        events: {
          CREATE: 'draw.create',
          DELETE: 'draw.delete',
          UPDATE: 'draw.update',
          SELECTION_CHANGE: 'draw.selectionchange',
          MODE_CHANGE: 'draw.modechange',
          ACTIONABLE: 'draw.actionable',
          RENDER: 'draw.render',
          COMBINE_FEATURES: 'draw.combine',
          UNCOMBINE_FEATURES: 'draw.uncombine'
        },
        updateActions: { MOVE: 'move', CHANGE_COORDINATES: 'change_coordinates' },
        meta: { FEATURE: 'feature', MIDPOINT: 'midpoint', VERTEX: 'vertex' },
        activeStates: { ACTIVE: 'true', INACTIVE: 'false' },
        interactions: ['scrollZoom', 'boxZoom', 'dragRotate', 'dragPan', 'keyboard', 'doubleClickZoom', 'touchZoomRotate'],
        LAT_MIN: -90,
        LAT_RENDERED_MIN: -85,
        LAT_MAX: 90,
        LAT_RENDERED_MAX: 85,
        LNG_MIN: -270,
        LNG_MAX: 270
      }
    }, {}],
    24: [function (e, t, n) {
      'use strict'
      var o = e('./lib/mode_handler'), r = e('./lib/get_features_and_set_cursor'), i = e('./lib/features_at'),
        s = e('./lib/is_click'), a = e('./lib/is_tap'), c = e('./constants'), u = e('./modes/object_to_mode')
      t.exports = function (e) {
        var t = Object.keys(e.options.modes).reduce(function (t, n) {
          return t[n] = u(e.options.modes[n]), t
        }, {}), n = {}, l = {}, p = {}, f = null, h = null
        p.drag = function (t, n) {
          n({
            point: t.point,
            time: (new Date).getTime()
          }) ? (e.ui.queueMapClasses({ mouse: c.cursors.DRAG }), h.drag(t)) : t.originalEvent.stopPropagation()
        }, p.mousedrag = function (e) {
          p.drag(e, function (e) {
            return !s(n, e)
          })
        }, p.touchdrag = function (e) {
          p.drag(e, function (e) {
            return !a(l, e)
          })
        }, p.mousemove = function (t) {
          if (1 === (void 0 !== t.originalEvent.buttons ? t.originalEvent.buttons : t.originalEvent.which)) return p.mousedrag(t)
          var n = r(t, e)
          t.featureTarget = n, h.mousemove(t)
        }, p.mousedown = function (t) {
          n = { time: (new Date).getTime(), point: t.point }
          var o = r(t, e)
          t.featureTarget = o, h.mousedown(t)
        }, p.mouseup = function (t) {
          var o = r(t, e)
          t.featureTarget = o, s(n, { point: t.point, time: (new Date).getTime() }) ? h.click(t) : h.mouseup(t)
        }, p.mouseout = function (e) {
          h.mouseout(e)
        }, p.touchstart = function (t) {
          if (t.originalEvent.preventDefault(), e.options.touchEnabled) {
            l = { time: (new Date).getTime(), point: t.point }
            var n = i.touch(t, null, e)[0]
            t.featureTarget = n, h.touchstart(t)
          }
        }, p.touchmove = function (t) {
          if (t.originalEvent.preventDefault(), e.options.touchEnabled) return h.touchmove(t), p.touchdrag(t)
        }, p.touchend = function (t) {
          if (t.originalEvent.preventDefault(), e.options.touchEnabled) {
            var n = i.touch(t, null, e)[0]
            t.featureTarget = n, a(l, {
              time: (new Date).getTime(),
              point: t.point
            }) ? h.tap(t) : h.touchend(t)
          }
        }
        var d = function (e) {
          return !(8 === e || 46 === e || e >= 48 && e <= 57)
        }

        function g (n, r) {
          var i = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
          h.stop()
          var s = t[n]
          if (void 0 === s) throw new Error(n + ' is not valid')
          f = n
          var a = s(e, r)
          h = o(a, e), i.silent || e.map.fire(c.events.MODE_CHANGE, { mode: n }), e.store.setDirty(), e.store.render()
        }

        p.keydown = function (t) {
          'mapboxgl-canvas' === (t.srcElement || t.target).classList[0] && (8 !== t.keyCode && 46 !== t.keyCode || !e.options.controls.trash ? d(t.keyCode) ? h.keydown(t) : 49 === t.keyCode && e.options.controls.point ? g(c.modes.DRAW_POINT) : 50 === t.keyCode && e.options.controls.line_string ? g(c.modes.DRAW_LINE_STRING) : 51 === t.keyCode && e.options.controls.polygon && g(c.modes.DRAW_POLYGON) : (t.preventDefault(), h.trash()))
        }, p.keyup = function (e) {
          d(e.keyCode) && h.keyup(e)
        }, p.zoomend = function () {
          e.store.changeZoom()
        }, p.data = function (t) {
          if ('style' === t.dataType) {
            var n = e.setup, o = e.map, r = e.options, i = e.store
            r.styles.some(function (e) {
              return o.getLayer(e.id)
            }) || (n.addLayers(), i.setDirty(), i.render())
          }
        }
        var y = { trash: !1, combineFeatures: !1, uncombineFeatures: !1 }
        return {
          start: function () {
            f = e.options.defaultMode, h = o(t[f](e), e)
          }, changeMode: g, actionable: function (t) {
            var n = !1
            Object.keys(t).forEach(function (e) {
              if (void 0 === y[e]) throw new Error('Invalid action type')
              y[e] !== t[e] && (n = !0), y[e] = t[e]
            }), n && e.map.fire(c.events.ACTIONABLE, { actions: y })
          }, currentModeName: function () {
            return f
          }, currentModeRender: function (e, t) {
            return h.render(e, t)
          }, fire: function (e, t) {
            p[e] && p[e](t)
          }, addEventListeners: function () {
            e.map.on('mousemove', p.mousemove), e.map.on('mousedown', p.mousedown), e.map.on('mouseup', p.mouseup), e.map.on('data', p.data), e.map.on('touchmove', p.touchmove), e.map.on('touchstart', p.touchstart), e.map.on('touchend', p.touchend), e.container.addEventListener('mouseout', p.mouseout), e.options.keybindings && (e.container.addEventListener('keydown', p.keydown), e.container.addEventListener('keyup', p.keyup))
          }, removeEventListeners: function () {
            e.map.off('mousemove', p.mousemove), e.map.off('mousedown', p.mousedown), e.map.off('mouseup', p.mouseup), e.map.off('data', p.data), e.map.off('touchmove', p.touchmove), e.map.off('touchstart', p.touchstart), e.map.off('touchend', p.touchend), e.container.removeEventListener('mouseout', p.mouseout), e.options.keybindings && (e.container.removeEventListener('keydown', p.keydown), e.container.removeEventListener('keyup', p.keyup))
          }, trash: function (e) {
            h.trash(e)
          }, combineFeatures: function () {
            h.combineFeatures()
          }, uncombineFeatures: function () {
            h.uncombineFeatures()
          }, getMode: function () {
            return f
          }
        }
      }
    }, {
      './constants': 23,
      './lib/features_at': 37,
      './lib/get_features_and_set_cursor': 38,
      './lib/is_click': 39,
      './lib/is_tap': 41,
      './lib/mode_handler': 43,
      './modes/object_to_mode': 59
    }],
    25: [function (e, t, n) {
      'use strict'
      var o = e('hat'), r = e('../constants'), i = function (e, t) {
        this.ctx = e, this.properties = t.properties || {}, this.coordinates = t.geometry.coordinates, this.id = t.id || o(), this.type = t.geometry.type
      }
      i.prototype.changed = function () {
        this.ctx.store.featureChanged(this.id)
      }, i.prototype.incomingCoords = function (e) {
        this.setCoordinates(e)
      }, i.prototype.setCoordinates = function (e) {
        this.coordinates = e, this.changed()
      }, i.prototype.getCoordinates = function () {
        return JSON.parse(JSON.stringify(this.coordinates))
      }, i.prototype.setProperty = function (e, t) {
        this.properties[e] = t
      }, i.prototype.toGeoJSON = function () {
        return JSON.parse(JSON.stringify({
          id: this.id,
          type: r.geojsonTypes.FEATURE,
          properties: this.properties,
          geometry: { coordinates: this.getCoordinates(), type: this.type }
        }))
      }, i.prototype.internal = function (e) {
        var t = {
          id: this.id,
          meta: r.meta.FEATURE,
          'meta:type': this.type,
          active: r.activeStates.INACTIVE,
          mode: e
        }
        if (this.ctx.options.userProperties) for (var n in this.properties) t['user_' + n] = this.properties[n]
        return {
          type: r.geojsonTypes.FEATURE,
          properties: t,
          geometry: { coordinates: this.getCoordinates(), type: this.type }
        }
      }, t.exports = i
    }, { '../constants': 23, hat: 14 }],
    26: [function (e, t, n) {
      'use strict'
      var o = e('./feature'), r = function (e, t) {
        o.call(this, e, t)
      };
      (r.prototype = Object.create(o.prototype)).isValid = function () {
        return this.coordinates.length > 1
      }, r.prototype.addCoordinate = function (e, t, n) {
        this.changed()
        var o = parseInt(e, 10)
        this.coordinates.splice(o, 0, [t, n])
      }, r.prototype.getCoordinate = function (e) {
        var t = parseInt(e, 10)
        return JSON.parse(JSON.stringify(this.coordinates[t]))
      }, r.prototype.removeCoordinate = function (e) {
        this.changed(), this.coordinates.splice(parseInt(e, 10), 1)
      }, r.prototype.updateCoordinate = function (e, t, n) {
        var o = parseInt(e, 10)
        this.coordinates[o] = [t, n], this.changed()
      }, t.exports = r
    }, { './feature': 25 }],
    27: [function (e, t, n) {
      'use strict'
      var o = e('./feature'), r = e('../constants'), i = e('hat'),
        s = { MultiPoint: e('./point'), MultiLineString: e('./line_string'), MultiPolygon: e('./polygon') },
        a = function (e, t, n, o, r) {
          var i = n.split('.'), s = parseInt(i[0], 10), a = i[1] ? i.slice(1).join('.') : null
          return e[s][t](a, o, r)
        }, c = function (e, t) {
          if (o.call(this, e, t), delete this.coordinates, this.model = s[t.geometry.type], void 0 === this.model) throw new TypeError(t.geometry.type + ' is not a valid type')
          this.features = this._coordinatesToFeatures(t.geometry.coordinates)
        };
      (c.prototype = Object.create(o.prototype))._coordinatesToFeatures = function (e) {
        var t = this, n = this.model.bind(this)
        return e.map(function (e) {
          return new n(t.ctx, {
            id: i(),
            type: r.geojsonTypes.FEATURE,
            properties: {},
            geometry: { coordinates: e, type: t.type.replace('Multi', '') }
          })
        })
      }, c.prototype.isValid = function () {
        return this.features.every(function (e) {
          return e.isValid()
        })
      }, c.prototype.setCoordinates = function (e) {
        this.features = this._coordinatesToFeatures(e), this.changed()
      }, c.prototype.getCoordinate = function (e) {
        return a(this.features, 'getCoordinate', e)
      }, c.prototype.getCoordinates = function () {
        return JSON.parse(JSON.stringify(this.features.map(function (e) {
          return e.type === r.geojsonTypes.POLYGON ? e.getCoordinates() : e.coordinates
        })))
      }, c.prototype.updateCoordinate = function (e, t, n) {
        a(this.features, 'updateCoordinate', e, t, n), this.changed()
      }, c.prototype.addCoordinate = function (e, t, n) {
        a(this.features, 'addCoordinate', e, t, n), this.changed()
      }, c.prototype.removeCoordinate = function (e) {
        a(this.features, 'removeCoordinate', e), this.changed()
      }, c.prototype.getFeatures = function () {
        return this.features
      }, t.exports = c
    }, { '../constants': 23, './feature': 25, './line_string': 26, './point': 28, './polygon': 29, hat: 14 }],
    28: [function (e, t, n) {
      'use strict'
      var o = e('./feature'), r = function (e, t) {
        o.call(this, e, t)
      };
      (r.prototype = Object.create(o.prototype)).isValid = function () {
        return 'number' == typeof this.coordinates[0] && 'number' == typeof this.coordinates[1]
      }, r.prototype.updateCoordinate = function (e, t, n) {
        3 === arguments.length ? this.coordinates = [t, n] : this.coordinates = [e, t], this.changed()
      }, r.prototype.getCoordinate = function () {
        return this.getCoordinates()
      }, t.exports = r
    }, { './feature': 25 }],
    29: [function (e, t, n) {
      'use strict'
      var o = e('./feature'), r = function (e, t) {
        o.call(this, e, t), this.coordinates = this.coordinates.map(function (e) {
          return e.slice(0, -1)
        })
      };
      (r.prototype = Object.create(o.prototype)).isValid = function () {
        return 0 !== this.coordinates.length && this.coordinates.every(function (e) {
          return e.length > 2
        })
      }, r.prototype.incomingCoords = function (e) {
        this.coordinates = e.map(function (e) {
          return e.slice(0, -1)
        }), this.changed()
      }, r.prototype.setCoordinates = function (e) {
        this.coordinates = e, this.changed()
      }, r.prototype.addCoordinate = function (e, t, n) {
        this.changed()
        var o = e.split('.').map(function (e) {
          return parseInt(e, 10)
        })
        this.coordinates[o[0]].splice(o[1], 0, [t, n])
      }, r.prototype.removeCoordinate = function (e) {
        this.changed()
        var t = e.split('.').map(function (e) {
          return parseInt(e, 10)
        }), n = this.coordinates[t[0]]
        n && (n.splice(t[1], 1), n.length < 3 && this.coordinates.splice(t[0], 1))
      }, r.prototype.getCoordinate = function (e) {
        var t = e.split('.').map(function (e) {
          return parseInt(e, 10)
        }), n = this.coordinates[t[0]]
        return JSON.parse(JSON.stringify(n[t[1]]))
      }, r.prototype.getCoordinates = function () {
        return this.coordinates.map(function (e) {
          return e.concat([e[0]])
        })
      }, r.prototype.updateCoordinate = function (e, t, n) {
        this.changed()
        var o = e.split('.'), r = parseInt(o[0], 10), i = parseInt(o[1], 10)
        void 0 === this.coordinates[r] && (this.coordinates[r] = []), this.coordinates[r][i] = [t, n]
      }, t.exports = r
    }, { './feature': 25 }],
    30: [function (e, t, n) {
      'use strict'
      var o = e('../constants')
      t.exports = {
        isOfMetaType: function (e) {
          return function (t) {
            var n = t.featureTarget
            return !!n && (!!n.properties && n.properties.meta === e)
          }
        }, isShiftMousedown: function (e) {
          return !!e.originalEvent && (!!e.originalEvent.shiftKey && 0 === e.originalEvent.button)
        }, isActiveFeature: function (e) {
          return !!e.featureTarget && (!!e.featureTarget.properties && (e.featureTarget.properties.active === o.activeStates.ACTIVE && e.featureTarget.properties.meta === o.meta.FEATURE))
        }, isInactiveFeature: function (e) {
          return !!e.featureTarget && (!!e.featureTarget.properties && (e.featureTarget.properties.active === o.activeStates.INACTIVE && e.featureTarget.properties.meta === o.meta.FEATURE))
        }, noTarget: function (e) {
          return void 0 === e.featureTarget
        }, isFeature: function (e) {
          return !!e.featureTarget && (!!e.featureTarget.properties && e.featureTarget.properties.meta === o.meta.FEATURE)
        }, isVertex: function (e) {
          var t = e.featureTarget
          return !!t && (!!t.properties && t.properties.meta === o.meta.VERTEX)
        }, isShiftDown: function (e) {
          return !!e.originalEvent && !0 === e.originalEvent.shiftKey
        }, isEscapeKey: function (e) {
          return 27 === e.keyCode
        }, isEnterKey: function (e) {
          return 13 === e.keyCode
        }, true: function () {
          return !0
        }
      }
    }, { '../constants': 23 }],
    31: [function (e, t, n) {
      'use strict'
      var o = e('@mapbox/geojson-extent'), r = e('../constants'), i = r.LAT_MIN, s = r.LAT_MAX,
        a = r.LAT_RENDERED_MIN, c = r.LAT_RENDERED_MAX, u = r.LNG_MIN, l = r.LNG_MAX
      t.exports = function (e, t) {
        var n = i, r = s, p = i, f = s, h = l, d = u
        e.forEach(function (e) {
          var t = o(e), i = t[1], s = t[3], a = t[0], c = t[2]
          i > n && (n = i), s < r && (r = s), s > p && (p = s), i < f && (f = i), a < h && (h = a), c > d && (d = c)
        })
        var g = t
        return n + g.lat > c && (g.lat = c - n), p + g.lat > s && (g.lat = s - p), r + g.lat < a && (g.lat = a - r), f + g.lat < i && (g.lat = i - f), h + g.lng <= u && (g.lng += 360 * Math.ceil(Math.abs(g.lng) / 360)), d + g.lng >= l && (g.lng -= 360 * Math.ceil(Math.abs(g.lng) / 360)), g
      }
    }, { '../constants': 23, '@mapbox/geojson-extent': 6 }],
    32: [function (e, t, n) {
      'use strict'
      var o = e('../constants')
      t.exports = function (e, t, n, r) {
        var i = t.geometry.coordinates, s = n.geometry.coordinates
        if (i[1] > o.LAT_RENDERED_MAX || i[1] < o.LAT_RENDERED_MIN || s[1] > o.LAT_RENDERED_MAX || s[1] < o.LAT_RENDERED_MIN) return null
        var a = r.project([i[0], i[1]]), c = r.project([s[0], s[1]]),
          u = r.unproject([(a.x + c.x) / 2, (a.y + c.y) / 2])
        return {
          type: o.geojsonTypes.FEATURE,
          properties: {
            meta: o.meta.MIDPOINT,
            parent: e,
            lng: u.lng,
            lat: u.lat,
            coord_path: n.properties.coord_path
          },
          geometry: { type: o.geojsonTypes.POINT, coordinates: [u.lng, u.lat] }
        }
      }
    }, { '../constants': 23 }],
    33: [function (e, t, n) {
      'use strict'
      var o = e('./create_vertex'), r = e('./create_midpoint'), i = e('../constants')
      t.exports = function e (t) {
        var n, s = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null, c = t.geometry,
          u = c.type, l = c.coordinates, p = t.properties && t.properties.id, f = []

        function h (e, t) {
          var n = '', i = null
          e.forEach(function (e, a) {
            var c = void 0 !== t && null !== t ? t + '.' + a : String(a), u = o(p, e, c, d(c))
            if (s.midpoints && i) {
              var l = r(p, i, u, s.map)
              l && f.push(l)
            }
            i = u
            var h = JSON.stringify(e)
            n !== h && f.push(u), 0 === a && (n = h)
          })
        }

        function d (e) {
          return !!s.selectedPaths && -1 !== s.selectedPaths.indexOf(e)
        }

        return u === i.geojsonTypes.POINT ? f.push(o(p, l, a, d(a))) : u === i.geojsonTypes.POLYGON ? l.forEach(function (e, t) {
          h(e, null !== a ? a + '.' + t : String(t))
        }) : u === i.geojsonTypes.LINE_STRING ? h(l, a) : 0 === u.indexOf(i.geojsonTypes.MULTI_PREFIX) && (n = u.replace(i.geojsonTypes.MULTI_PREFIX, ''), l.forEach(function (o, r) {
          var a = {
            type: i.geojsonTypes.FEATURE,
            properties: t.properties,
            geometry: { type: n, coordinates: o }
          }
          f = f.concat(e(a, s, r))
        })), f
      }
    }, { '../constants': 23, './create_midpoint': 32, './create_vertex': 34 }],
    34: [function (e, t, n) {
      'use strict'
      var o = e('../constants')
      t.exports = function (e, t, n, r) {
        return {
          type: o.geojsonTypes.FEATURE,
          properties: {
            meta: o.meta.VERTEX,
            parent: e,
            coord_path: n,
            active: r ? o.activeStates.ACTIVE : o.activeStates.INACTIVE
          },
          geometry: { type: o.geojsonTypes.POINT, coordinates: t }
        }
      }
    }, { '../constants': 23 }],
    35: [function (e, t, n) {
      'use strict'
      t.exports = {
        enable: function (e) {
          setTimeout(function () {
            e.map && e.map.doubleClickZoom && e._ctx && e._ctx.store && e._ctx.store.getInitialConfigValue && e._ctx.store.getInitialConfigValue('doubleClickZoom') && e.map.doubleClickZoom.enable()
          }, 0)
        }, disable: function (e) {
          setTimeout(function () {
            e.map && e.map.doubleClickZoom && e.map.doubleClickZoom.disable()
          }, 0)
        }
      }
    }, {}],
    36: [function (e, t, n) {
      'use strict'
      t.exports = function (e, t) {
        var n = e.x - t.x, o = e.y - t.y
        return Math.sqrt(n * n + o * o)
      }
    }, {}],
    37: [function (e, t, n) {
      'use strict'
      var o = e('./sort_features'), r = e('./map_event_to_bounding_box'), i = e('../constants'),
        s = e('./string_set'), a = [i.meta.FEATURE, i.meta.MIDPOINT, i.meta.VERTEX]

      function c (e, t, n, i) {
        if (null === n.map) return []
        var c = e ? r(e, i) : t, u = {}
        n.options.styles && (u.layers = n.options.styles.map(function (e) {
          return e.id
        }))
        var l = n.map.queryRenderedFeatures(c, u).filter(function (e) {
          return -1 !== a.indexOf(e.properties.meta)
        }), p = new s, f = []
        return l.forEach(function (e) {
          var t = e.properties.id
          p.has(t) || (p.add(t), f.push(e))
        }), o(f)
      }

      t.exports = {
        click: function (e, t, n) {
          return c(e, t, n, n.options.clickBuffer)
        }, touch: function (e, t, n) {
          return c(e, t, n, n.options.touchBuffer)
        }
      }
    }, { '../constants': 23, './map_event_to_bounding_box': 42, './sort_features': 46, './string_set': 47 }],
    38: [function (e, t, n) {
      'use strict'
      var o = e('./features_at'), r = e('../constants')
      t.exports = function (e, t) {
        var n = o.click(e, null, t), i = { mouse: r.cursors.NONE }
        return n[0] && (i.mouse = n[0].properties.active === r.activeStates.ACTIVE ? r.cursors.MOVE : r.cursors.POINTER, i.feature = n[0].properties.meta), -1 !== t.events.currentModeName().indexOf('draw') && (i.mouse = r.cursors.ADD), t.ui.queueMapClasses(i), t.ui.updateMapClasses(), n[0]
      }
    }, { '../constants': 23, './features_at': 37 }],
    39: [function (e, t, n) {
      'use strict'
      var o = e('./euclidean_distance')
      t.exports = function (e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          r = null != n.fineTolerance ? n.fineTolerance : 4,
          i = null != n.grossTolerance ? n.grossTolerance : 12, s = null != n.interval ? n.interval : 500
        e.point = e.point || t.point, e.time = e.time || t.time
        var a = o(e.point, t.point)
        return a < r || a < i && t.time - e.time < s
      }
    }, { './euclidean_distance': 36 }],
    40: [function (e, t, n) {
      'use strict'
      t.exports = function (e, t) {
        return !!e.lngLat && e.lngLat.lng === t[0] && e.lngLat.lat === t[1]
      }
    }, {}],
    41: [function (e, t, n) {
      'use strict'
      var o = e('./euclidean_distance')
      t.exports = function (e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
          r = null != n.tolerance ? n.tolerance : 25, i = null != n.interval ? n.interval : 250
        return e.point = e.point || t.point, e.time = e.time || t.time, o(e.point, t.point) < r && t.time - e.time < i
      }
    }, { './euclidean_distance': 36 }],
    42: [function (e, t, n) {
      'use strict'
      t.exports = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0
        return [[e.point.x - t, e.point.y - t], [e.point.x + t, e.point.y + t]]
      }
    }, {}],
    43: [function (e, t, n) {
      'use strict'
      t.exports = function (e, t) {
        var n = {
          drag: [],
          click: [],
          mousemove: [],
          mousedown: [],
          mouseup: [],
          mouseout: [],
          keydown: [],
          keyup: [],
          touchstart: [],
          touchmove: [],
          touchend: [],
          tap: []
        }, o = {
          on: function (e, t, o) {
            if (void 0 === n[e]) throw new Error('Invalid event type: ' + e)
            n[e].push({ selector: t, fn: o })
          }, render: function (e) {
            t.store.featureChanged(e)
          }
        }, r = function (e, r) {
          for (var i = n[e], s = i.length; s--;) {
            var a = i[s]
            if (a.selector(r)) {
              a.fn.call(o, r), t.store.render(), t.ui.updateMapClasses()
              break
            }
          }
        }
        return e.start.call(o), {
          render: e.render, stop: function () {
            e.stop && e.stop()
          }, trash: function () {
            e.trash && (e.trash(), t.store.render())
          }, combineFeatures: function () {
            e.combineFeatures && e.combineFeatures()
          }, uncombineFeatures: function () {
            e.uncombineFeatures && e.uncombineFeatures()
          }, drag: function (e) {
            r('drag', e)
          }, click: function (e) {
            r('click', e)
          }, mousemove: function (e) {
            r('mousemove', e)
          }, mousedown: function (e) {
            r('mousedown', e)
          }, mouseup: function (e) {
            r('mouseup', e)
          }, mouseout: function (e) {
            r('mouseout', e)
          }, keydown: function (e) {
            r('keydown', e)
          }, keyup: function (e) {
            r('keyup', e)
          }, touchstart: function (e) {
            r('touchstart', e)
          }, touchmove: function (e) {
            r('touchmove', e)
          }, touchend: function (e) {
            r('touchend', e)
          }, tap: function (e) {
            r('tap', e)
          }
        }
      }
    }, {}],
    44: [function (e, t, n) {
      'use strict'
      var o = e('@mapbox/point-geometry')
      t.exports = function (e, t) {
        var n = t.getBoundingClientRect()
        return new o(e.clientX - n.left - (t.clientLeft || 0), e.clientY - n.top - (t.clientTop || 0))
      }
    }, { '@mapbox/point-geometry': 11 }],
    45: [function (e, t, n) {
      'use strict'
      var o = e('./constrain_feature_movement'), r = e('../constants')
      t.exports = function (e, t) {
        var n = o(e.map(function (e) {
          return e.toGeoJSON()
        }), t)
        e.forEach(function (e) {
          var t = e.getCoordinates(), o = function (e) {
            var t = { lng: e[0] + n.lng, lat: e[1] + n.lat }
            return [t.lng, t.lat]
          }, i = function (e) {
            return e.map(function (e) {
              return o(e)
            })
          }, s = void 0
          e.type === r.geojsonTypes.POINT ? s = o(t) : e.type === r.geojsonTypes.LINE_STRING || e.type === r.geojsonTypes.MULTI_POINT ? s = t.map(o) : e.type === r.geojsonTypes.POLYGON || e.type === r.geojsonTypes.MULTI_LINE_STRING ? s = t.map(i) : e.type === r.geojsonTypes.MULTI_POLYGON && (s = t.map(function (e) {
            return e.map(function (e) {
              return i(e)
            })
          })), e.incomingCoords(s)
        })
      }
    }, { '../constants': 23, './constrain_feature_movement': 31 }],
    46: [function (e, t, n) {
      'use strict'
      var o = e('@mapbox/geojson-area'), r = e('../constants'), i = { Point: 0, LineString: 1, Polygon: 2 }

      function s (e, t) {
        var n = i[e.geometry.type] - i[t.geometry.type]
        return 0 === n && e.geometry.type === r.geojsonTypes.POLYGON ? e.area - t.area : n
      }

      t.exports = function (e) {
        return e.map(function (e) {
          return e.geometry.type === r.geojsonTypes.POLYGON && (e.area = o.geometry({
            type: r.geojsonTypes.FEATURE,
            property: {},
            geometry: e.geometry
          })), e
        }).sort(s).map(function (e) {
          return delete e.area, e
        })
      }
    }, { '../constants': 23, '@mapbox/geojson-area': 3 }],
    47: [function (e, t, n) {
      'use strict'

      function o (e) {
        if (this._items = {}, this._nums = {}, this._length = e ? e.length : 0, e) for (var t = 0, n = e.length; t < n; t++) this.add(e[t]), void 0 !== e[t] && ('string' == typeof e[t] ? this._items[e[t]] = t : this._nums[e[t]] = t)
      }

      o.prototype.add = function (e) {
        return this.has(e) ? this : (this._length++, 'string' == typeof e ? this._items[e] = this._length : this._nums[e] = this._length, this)
      }, o.prototype.delete = function (e) {
        return !1 === this.has(e) ? this : (this._length--, delete this._items[e], delete this._nums[e], this)
      }, o.prototype.has = function (e) {
        return ('string' == typeof e || 'number' == typeof e) && (void 0 !== this._items[e] || void 0 !== this._nums[e])
      }, o.prototype.values = function () {
        var e = this, t = []
        return Object.keys(this._items).forEach(function (n) {
          t.push({ k: n, v: e._items[n] })
        }), Object.keys(this._nums).forEach(function (n) {
          t.push({ k: JSON.parse(n), v: e._nums[n] })
        }), t.sort(function (e, t) {
          return e.v - t.v
        }).map(function (e) {
          return e.k
        })
      }, o.prototype.clear = function () {
        return this._length = 0, this._items = {}, this._nums = {}, this
      }, t.exports = o
    }, {}],
    48: [function (e, t, n) {
      'use strict'
      t.exports = function (e, t) {
        return e.length === t.length && JSON.stringify(e.map(function (e) {
          return e
        }).sort()) === JSON.stringify(t.map(function (e) {
          return e
        }).sort())
      }
    }, {}],
    49: [function (e, t, n) {
      'use strict'
      t.exports = [{
        id: 'gl-draw-polygon-fill-inactive',
        type: 'fill',
        filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
        paint: { 'fill-color': '#3bb2d0', 'fill-outline-color': '#3bb2d0', 'fill-opacity': .1 }
      }, {
        id: 'gl-draw-polygon-fill-active',
        type: 'fill',
        filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
        paint: { 'fill-color': '#dc143c', 'fill-outline-color': '#dc143c', 'fill-opacity': .1 }
      }, {
        id: 'gl-draw-polygon-midpoint',
        type: 'circle',
        filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
        paint: { 'circle-radius': 3, 'circle-color': '#dc143c' }
      }, {
        id: 'gl-draw-polygon-stroke-inactive',
        type: 'line',
        filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Polygon'], ['!=', 'mode', 'static']],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#3bb2d0', 'line-width': 2 }
      }, {
        id: 'gl-draw-polygon-stroke-active',
        type: 'line',
        filter: ['all', ['==', 'active', 'true'], ['==', '$type', 'Polygon']],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#dc143c', 'line-dasharray': [.2, 2], 'line-width': 2 }
      }, {
        id: 'gl-draw-line-inactive',
        type: 'line',
        filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'LineString'], ['!=', 'mode', 'static']],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#3bb2d0', 'line-width': 2 }
      }, {
        id: 'gl-draw-line-active',
        type: 'line',
        filter: ['all', ['==', '$type', 'LineString'], ['==', 'active', 'true']],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#dc143c', 'line-dasharray': [.2, 2], 'line-width': 2 }
      }, {
        id: 'gl-draw-polygon-and-line-vertex-stroke-inactive',
        type: 'circle',
        filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
        paint: { 'circle-radius': 5, 'circle-color': '#fff' }
      }, {
        id: 'gl-draw-polygon-and-line-vertex-inactive',
        type: 'circle',
        filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point'], ['!=', 'mode', 'static']],
        paint: { 'circle-radius': 3, 'circle-color': '#fbb03b' }
      }, {
        id: 'gl-draw-point-point-stroke-inactive',
        type: 'circle',
        filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['==', 'meta', 'feature'], ['!=', 'mode', 'static']],
        paint: { 'circle-radius': 5, 'circle-opacity': 1, 'circle-color': '#fff' }
      }, {
        id: 'gl-draw-point-inactive',
        type: 'circle',
        filter: ['all', ['==', 'active', 'false'], ['==', '$type', 'Point'], ['==', 'meta', 'feature'], ['!=', 'mode', 'static']],
        paint: { 'circle-radius': 3, 'circle-color': '#dc143c' }
      }, {
        id: 'gl-draw-point-stroke-active',
        type: 'circle',
        filter: ['all', ['==', '$type', 'Point'], ['==', 'active', 'true'], ['!=', 'meta', 'midpoint']],
        paint: { 'circle-radius': 7, 'circle-color': '#fff' }
      }, {
        id: 'gl-draw-point-active',
        type: 'circle',
        filter: ['all', ['==', '$type', 'Point'], ['!=', 'meta', 'midpoint'], ['==', 'active', 'true']],
        paint: { 'circle-radius': 5, 'circle-color': '#fbb03b' }
      }, {
        id: 'gl-draw-polygon-fill-static',
        type: 'fill',
        filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
        paint: { 'fill-color': '#404040', 'fill-outline-color': '#404040', 'fill-opacity': .1 }
      }, {
        id: 'gl-draw-polygon-stroke-static',
        type: 'line',
        filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Polygon']],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#404040', 'line-width': 2 }
      }, {
        id: 'gl-draw-line-static',
        type: 'line',
        filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'LineString']],
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#404040', 'line-width': 2 }
      }, {
        id: 'gl-draw-point-static',
        type: 'circle',
        filter: ['all', ['==', 'mode', 'static'], ['==', '$type', 'Point']],
        paint: { 'circle-radius': 5, 'circle-color': '#404040' }
      }]
    }, {}],
    50: [function (e, t, n) {
      'use strict'
      t.exports = function (e, t, n) {
        var o = void 0, r = void 0

        function i () {
          o = !1, r && (s.apply(n, r), r = !1)
        }

        function s () {
          o ? r = arguments : (o = !0, e.apply(n, arguments), setTimeout(i, t))
        }

        return s
      }
    }, {}],
    51: [function (e, t, n) {
      'use strict'
      t.exports = function (e) {
        return [].concat(e).filter(function (e) {
          return void 0 !== e
        })
      }
    }, {}],
    52: [function (e, t, n) {
      'use strict'
      var o = e('../lib/common_selectors'), r = o.noTarget, i = o.isOfMetaType, s = o.isInactiveFeature,
        a = o.isShiftDown, c = e('../lib/create_supplementary_points'),
        u = e('../lib/constrain_feature_movement'), l = e('../lib/double_click_zoom'), p = e('../constants'),
        f = e('../lib/common_selectors'), h = e('../lib/move_features'), d = i(p.meta.VERTEX),
        g = i(p.meta.MIDPOINT), y = {
          fireUpdate: function () {
            this.map.fire(p.events.UPDATE, {
              action: p.updateActions.CHANGE_COORDINATES,
              features: this.getSelected().map(function (e) {
                return e.toGeoJSON()
              })
            })
          }, fireActionable: function (e) {
            this.setActionableState({
              combineFeatures: !1,
              uncombineFeatures: !1,
              trash: e.selectedCoordPaths.length > 0
            })
          }, startDragging: function (e, t) {
            this.map.dragPan.disable(), e.canDragMove = !0, e.dragMoveLocation = t.lngLat
          }, stopDragging: function (e) {
            this.map.dragPan.enable(), e.dragMoving = !1, e.canDragMove = !1, e.dragMoveLocation = null
          }, onVertex: function (e, t) {
            this.startDragging(e, t)
            var n = t.featureTarget.properties, o = e.selectedCoordPaths.indexOf(n.coord_path)
            a(t) || -1 !== o ? a(t) && -1 === o && e.selectedCoordPaths.push(n.coord_path) : e.selectedCoordPaths = [n.coord_path]
            var r = this.pathsToCoordinates(e.featureId, e.selectedCoordPaths)
            this.setSelectedCoordinates(r)
          }, onMidpoint: function (e, t) {
            this.startDragging(e, t)
            var n = t.featureTarget.properties
            e.feature.addCoordinate(n.coord_path, n.lng, n.lat), this.fireUpdate(), e.selectedCoordPaths = [n.coord_path]
          }, pathsToCoordinates: function (e, t) {
            return t.map(function (t) {
              return { feature_id: e, coord_path: t }
            })
          }, onFeature: function (e, t) {
            0 === e.selectedCoordPaths.length ? this.startDragging(e, t) : this.stopDragging(e)
          }, dragFeature: function (e, t, n) {
            h(this.getSelected(), n), e.dragMoveLocation = t.lngLat
          }, dragVertex: function (e, t, n) {
            for (var o = e.selectedCoordPaths.map(function (t) {
              return e.feature.getCoordinate(t)
            }), r = o.map(function (e) {
              return {
                type: p.geojsonTypes.FEATURE,
                properties: {},
                geometry: { type: p.geojsonTypes.POINT, coordinates: e }
              }
            }), i = u(r, n), s = 0; s < o.length; s++) {
              var a = o[s]
              e.feature.updateCoordinate(e.selectedCoordPaths[s], a[0] + i.lng, a[1] + i.lat)
            }
          }, clickNoTarget: function () {
            this.changeMode(p.modes.SIMPLE_SELECT)
          }, clickInactive: function () {
            this.changeMode(p.modes.SIMPLE_SELECT)
          }, clickActiveFeature: function (e) {
            e.selectedCoordPaths = [], this.clearSelectedCoordinates(), e.feature.changed()
          }, onSetup: function (e) {
            var t = e.featureId, n = this.getFeature(t)
            if (!n) throw new Error('You must provide a featureId to enter direct_select mode')
            if (n.type === p.geojsonTypes.POINT) throw new TypeError('direct_select mode doesn\'t handle point features')
            var o = {
              featureId: t,
              feature: n,
              dragMoveLocation: e.startPos || null,
              dragMoving: !1,
              canDragMove: !1,
              selectedCoordPaths: e.coordPath ? [e.coordPath] : []
            }
            return this.setSelectedCoordinates(this.pathsToCoordinates(t, o.selectedCoordPaths)), this.setSelected(t), l.disable(this), this.setActionableState({ trash: !0 }), o
          }, onStop: function () {
            l.enable(this), this.clearSelectedCoordinates()
          }, toDisplayFeatures: function (e, t, n) {
            e.featureId === t.properties.id ? (t.properties.active = p.activeStates.ACTIVE, n(t), c(t, {
              map: this.map,
              midpoints: !0,
              selectedPaths: e.selectedCoordPaths
            }).forEach(n)) : (t.properties.active = p.activeStates.INACTIVE, n(t)), this.fireActionable(e)
          }, onTrash: function (e) {
            e.selectedCoordPaths.sort().reverse().forEach(function (t) {
              return e.feature.removeCoordinate(t)
            }), this.map.fire(p.events.UPDATE, {
              action: p.updateActions.CHANGE_COORDINATES,
              features: this.getSelected().map(function (e) {
                return e.toGeoJSON()
              })
            }), e.selectedCoordPaths = [], this.clearSelectedCoordinates(), this.fireActionable(e), !1 === e.feature.isValid() && (this.deleteFeature([e.featureId]), this.changeMode(p.modes.SIMPLE_SELECT, {}))
          }, onMouseMove: function (e, t) {
            var n = f.isActiveFeature(t), o = d(t), r = 0 === e.selectedCoordPaths.length
            n && r ? this.updateUIClasses({ mouse: p.cursors.MOVE }) : o && !r ? this.updateUIClasses({ mouse: p.cursors.MOVE }) : this.updateUIClasses({ mouse: p.cursors.NONE }), this.stopDragging(e)
          }, onMouseOut: function (e) {
            e.dragMoving && this.fireUpdate()
          }
        }
      y.onTouchStart = y.onMouseDown = function (e, t) {
        return d(t) ? this.onVertex(e, t) : f.isActiveFeature(t) ? this.onFeature(e, t) : g(t) ? this.onMidpoint(e, t) : void 0
      }, y.onDrag = function (e, t) {
        if (!0 === e.canDragMove) {
          e.dragMoving = !0, t.originalEvent.stopPropagation()
          var n = { lng: t.lngLat.lng - e.dragMoveLocation.lng, lat: t.lngLat.lat - e.dragMoveLocation.lat }
          e.selectedCoordPaths.length > 0 ? this.dragVertex(e, t, n) : this.dragFeature(e, t, n), e.dragMoveLocation = t.lngLat
        }
      }, y.onClick = function (e, t) {
        return r(t) ? this.clickNoTarget(e, t) : f.isActiveFeature(t) ? this.clickActiveFeature(e, t) : s(t) ? this.clickInactive(e, t) : void this.stopDragging(e)
      }, y.onTap = function (e, t) {
        return r(t) ? this.clickNoTarget(e, t) : f.isActiveFeature(t) ? this.clickActiveFeature(e, t) : s(t) ? this.clickInactive(e, t) : void 0
      }, y.onTouchEnd = y.onMouseUp = function (e) {
        e.dragMoving && this.fireUpdate(), this.stopDragging(e)
      }, t.exports = y
    }, {
      '../constants': 23,
      '../lib/common_selectors': 30,
      '../lib/constrain_feature_movement': 31,
      '../lib/create_supplementary_points': 33,
      '../lib/double_click_zoom': 35,
      '../lib/move_features': 45
    }],
    53: [function (e, t, n) {
      'use strict'

      function o (e) {
        if (Array.isArray(e)) {
          for (var t = 0, n = Array(e.length); t < e.length; t++) n[t] = e[t]
          return n
        }
        return Array.from(e)
      }

      var r = e('../lib/common_selectors'), i = e('../lib/is_event_at_coordinates'),
        s = e('../lib/double_click_zoom'), a = e('../constants'), c = e('../lib/create_vertex'), u = {
          onSetup: function (e) {
            var t = (e = e || {}).featureId, n = void 0, r = void 0, i = 'forward'
            if (t) {
              if (!(n = this.getFeature(t))) throw new Error('Could not find a feature with the provided featureId')
              var c = e.from
              if (c && 'Feature' === c.type && c.geometry && 'Point' === c.geometry.type && (c = c.geometry), c && 'Point' === c.type && c.coordinates && 2 === c.coordinates.length && (c = c.coordinates), !c || !Array.isArray(c)) throw new Error('Please use the `from` property to indicate which point to continue the line from')
              var u = n.coordinates.length - 1
              if (n.coordinates[u][0] === c[0] && n.coordinates[u][1] === c[1]) {
                var l
                r = u + 1, (l = n).addCoordinate.apply(l, [r].concat(o(n.coordinates[u])))
              } else {
                if (n.coordinates[0][0] !== c[0] || n.coordinates[0][1] !== c[1]) throw new Error('`from` should match the point at either the start or the end of the provided LineString')
                var p
                i = 'backwards', r = 0, (p = n).addCoordinate.apply(p, [r].concat(o(n.coordinates[0])))
              }
            } else n = this.newFeature({
              type: a.geojsonTypes.FEATURE,
              properties: {},
              geometry: { type: a.geojsonTypes.LINE_STRING, coordinates: [] }
            }), r = 0, this.addFeature(n)
            return this.clearSelectedFeatures(), s.disable(this), this.updateUIClasses({ mouse: a.cursors.ADD }), this.activateUIButton(a.types.LINE), this.setActionableState({ trash: !0 }), {
              line: n,
              currentVertexPosition: r,
              direction: i
            }
          }, clickAnywhere: function (e, t) {
            if (e.currentVertexPosition > 0 && i(t, e.line.coordinates[e.currentVertexPosition - 1]) || 'backwards' === e.direction && i(t, e.line.coordinates[e.currentVertexPosition + 1])) return this.changeMode(a.modes.SIMPLE_SELECT, { featureIds: [e.line.id] })
            this.updateUIClasses({ mouse: a.cursors.ADD }), e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat), 'forward' === e.direction ? (e.currentVertexPosition++, e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat)) : e.line.addCoordinate(0, t.lngLat.lng, t.lngLat.lat)
          }, clickOnVertex: function (e) {
            return this.changeMode(a.modes.SIMPLE_SELECT, { featureIds: [e.line.id] })
          }, onMouseMove: function (e, t) {
            e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat), r.isVertex(t) && this.updateUIClasses({ mouse: a.cursors.POINTER })
          }
        }
      u.onTap = u.onClick = function (e, t) {
        if (r.isVertex(t)) return this.clickOnVertex(e, t)
        this.clickAnywhere(e, t)
      }, u.onKeyUp = function (e, t) {
        r.isEnterKey(t) ? this.changeMode(a.modes.SIMPLE_SELECT, { featureIds: [e.line.id] }) : r.isEscapeKey(t) && (this.deleteFeature([e.line.id], { silent: !0 }), this.changeMode(a.modes.SIMPLE_SELECT))
      }, u.onStop = function (e) {
        s.enable(this), this.activateUIButton(), void 0 !== this.getFeature(e.line.id) && (e.line.removeCoordinate('' + e.currentVertexPosition), e.line.isValid() ? this.map.fire(a.events.CREATE, { features: [e.line.toGeoJSON()] }) : (this.deleteFeature([e.line.id], { silent: !0 }), this.changeMode(a.modes.SIMPLE_SELECT, {}, { silent: !0 })))
      }, u.onTrash = function (e) {
        this.deleteFeature([e.line.id], { silent: !0 }), this.changeMode(a.modes.SIMPLE_SELECT)
      }, u.toDisplayFeatures = function (e, t, n) {
        var o = t.properties.id === e.line.id
        if (t.properties.active = o ? a.activeStates.ACTIVE : a.activeStates.INACTIVE, !o) return n(t)
        t.geometry.coordinates.length < 2 || (t.properties.meta = a.meta.FEATURE, n(c(e.line.id, t.geometry.coordinates['forward' === e.direction ? t.geometry.coordinates.length - 2 : 1], '' + ('forward' === e.direction ? t.geometry.coordinates.length - 2 : 1), !1)), n(t))
      }, t.exports = u
    }, {
      '../constants': 23,
      '../lib/common_selectors': 30,
      '../lib/create_vertex': 34,
      '../lib/double_click_zoom': 35,
      '../lib/is_event_at_coordinates': 40
    }],
    54: [function (e, t, n) {
      'use strict'
      var o = e('../lib/common_selectors'), r = e('../constants'), i = {
        onSetup: function () {
          var e = this.newFeature({
            type: r.geojsonTypes.FEATURE,
            properties: {},
            geometry: { type: r.geojsonTypes.POINT, coordinates: [] }
          })
          return this.addFeature(e), this.clearSelectedFeatures(), this.updateUIClasses({ mouse: r.cursors.ADD }), this.activateUIButton(r.types.POINT), this.setActionableState({ trash: !0 }), { point: e }
        }, stopDrawingAndRemove: function (e) {
          this.deleteFeature([e.point.id], { silent: !0 }), this.changeMode(r.modes.SIMPLE_SELECT)
        }
      }
      i.onTap = i.onClick = function (e, t) {
        this.updateUIClasses({ mouse: r.cursors.MOVE }), e.point.updateCoordinate('', t.lngLat.lng, t.lngLat.lat), this.map.fire(r.events.CREATE, { features: [e.point.toGeoJSON()] }), this.changeMode(r.modes.SIMPLE_SELECT, { featureIds: [e.point.id] })
      }, i.onStop = function (e) {
        this.activateUIButton(), e.point.getCoordinate().length || this.deleteFeature([e.point.id], { silent: !0 })
      }, i.toDisplayFeatures = function (e, t, n) {
        var o = t.properties.id === e.point.id
        if (t.properties.active = o ? r.activeStates.ACTIVE : r.activeStates.INACTIVE, !o) return n(t)
      }, i.onTrash = i.stopDrawingAndRemove, i.onKeyUp = function (e, t) {
        if (o.isEscapeKey(t) || o.isEnterKey(t)) return this.stopDrawingAndRemove(e, t)
      }, t.exports = i
    }, { '../constants': 23, '../lib/common_selectors': 30 }],
    55: [function (e, t, n) {
      'use strict'
      var o = e('../lib/common_selectors'), r = e('../lib/double_click_zoom'), i = e('../constants'),
        s = e('../lib/is_event_at_coordinates'), a = e('../lib/create_vertex'), c = {
          onSetup: function () {
            var e = this.newFeature({
              type: i.geojsonTypes.FEATURE,
              properties: {},
              geometry: { type: i.geojsonTypes.POLYGON, coordinates: [[]] }
            })
            return this.addFeature(e), this.clearSelectedFeatures(), r.disable(this), this.updateUIClasses({ mouse: i.cursors.ADD }), this.activateUIButton(i.types.POLYGON), this.setActionableState({ trash: !0 }), {
              polygon: e,
              currentVertexPosition: 0
            }
          }, clickAnywhere: function (e, t) {
            if (e.currentVertexPosition > 0 && s(t, e.polygon.coordinates[0][e.currentVertexPosition - 1])) return this.changeMode(i.modes.SIMPLE_SELECT, { featureIds: [e.polygon.id] })
            this.updateUIClasses({ mouse: i.cursors.ADD }), e.polygon.updateCoordinate('0.' + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat), e.currentVertexPosition++, e.polygon.updateCoordinate('0.' + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat)
          }, clickOnVertex: function (e) {
            return this.changeMode(i.modes.SIMPLE_SELECT, { featureIds: [e.polygon.id] })
          }, onMouseMove: function (e, t) {
            e.polygon.updateCoordinate('0.' + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat), o.isVertex(t) && this.updateUIClasses({ mouse: i.cursors.POINTER })
          }
        }
      c.onTap = c.onClick = function (e, t) {
        return o.isVertex(t) ? this.clickOnVertex(e, t) : this.clickAnywhere(e, t)
      }, c.onKeyUp = function (e, t) {
        o.isEscapeKey(t) ? (this.deleteFeature([e.polygon.id], { silent: !0 }), this.changeMode(i.modes.SIMPLE_SELECT)) : o.isEnterKey(t) && this.changeMode(i.modes.SIMPLE_SELECT, { featureIds: [e.polygon.id] })
      }, c.onStop = function (e) {
        this.updateUIClasses({ mouse: i.cursors.NONE }), r.enable(this), this.activateUIButton(), void 0 !== this.getFeature(e.polygon.id) && (e.polygon.removeCoordinate('0.' + e.currentVertexPosition), e.polygon.isValid() ? this.map.fire(i.events.CREATE, { features: [e.polygon.toGeoJSON()] }) : (this.deleteFeature([e.polygon.id], { silent: !0 }), this.changeMode(i.modes.SIMPLE_SELECT, {}, { silent: !0 })))
      }, c.toDisplayFeatures = function (e, t, n) {
        var o = t.properties.id === e.polygon.id
        if (t.properties.active = o ? i.activeStates.ACTIVE : i.activeStates.INACTIVE, !o) return n(t)
        if (0 !== t.geometry.coordinates.length) {
          var r = t.geometry.coordinates[0].length
          if (!(r < 3)) {
            if (t.properties.meta = i.meta.FEATURE, n(a(e.polygon.id, t.geometry.coordinates[0][0], '0.0', !1)), r > 3) {
              var s = t.geometry.coordinates[0].length - 3
              n(a(e.polygon.id, t.geometry.coordinates[0][s], '0.' + s, !1))
            }
            if (r <= 4) {
              var c = [[t.geometry.coordinates[0][0][0], t.geometry.coordinates[0][0][1]], [t.geometry.coordinates[0][1][0], t.geometry.coordinates[0][1][1]]]
              if (n({
                type: i.geojsonTypes.FEATURE,
                properties: t.properties,
                geometry: { coordinates: c, type: i.geojsonTypes.LINE_STRING }
              }), 3 === r) return
            }
            return n(t)
          }
        }
      }, c.onTrash = function (e) {
        this.deleteFeature([e.polygon.id], { silent: !0 }), this.changeMode(i.modes.SIMPLE_SELECT)
      }, t.exports = c
    }, {
      '../constants': 23,
      '../lib/common_selectors': 30,
      '../lib/create_vertex': 34,
      '../lib/double_click_zoom': 35,
      '../lib/is_event_at_coordinates': 40
    }],
    56: [function (e, t, n) {
      'use strict'
      t.exports = ['simple_select', 'direct_select', 'draw_point', 'draw_polygon', 'draw_line_string'].reduce(function (t, n) {
        return t[n] = e('./' + n), t
      }, {}), t.exports = {
        simple_select: e('./simple_select'),
        direct_select: e('./direct_select'),
        draw_point: e('./draw_point'),
        draw_polygon: e('./draw_polygon'),
        draw_line_string: e('./draw_line_string')
      }
    }, {
      './direct_select': 52,
      './draw_line_string': 53,
      './draw_point': 54,
      './draw_polygon': 55,
      './simple_select': 60
    }],
    57: [function (e, t, n) {
      'use strict'
      var o = t.exports = e('./mode_interface_accessors')
      o.prototype.onSetup = function () {
      }, o.prototype.onDrag = function () {
      }, o.prototype.onClick = function () {
      }, o.prototype.onMouseMove = function () {
      }, o.prototype.onMouseDown = function () {
      }, o.prototype.onMouseUp = function () {
      }, o.prototype.onMouseOut = function () {
      }, o.prototype.onKeyUp = function () {
      }, o.prototype.onKeyDown = function () {
      }, o.prototype.onTouchStart = function () {
      }, o.prototype.onTouchMove = function () {
      }, o.prototype.onTouchEnd = function () {
      }, o.prototype.onTap = function () {
      }, o.prototype.onStop = function () {
      }, o.prototype.onTrash = function () {
      }, o.prototype.onCombineFeature = function () {
      }, o.prototype.onUncombineFeature = function () {
      }, o.prototype.toDisplayFeatures = function () {
        throw new Error('You must overwrite toDisplayFeatures')
      }
    }, { './mode_interface_accessors': 58 }],
    58: [function (e, t, n) {
      'use strict'
      var o = e('../constants'), r = e('../lib/features_at'), i = e('../feature_types/point'),
        s = e('../feature_types/line_string'), a = e('../feature_types/polygon'),
        c = e('../feature_types/multi_feature'), u = t.exports = function (e) {
          this.map = e.map, this.drawConfig = JSON.parse(JSON.stringify(e.options || {})), this._ctx = e
        }
      u.prototype.setSelected = function (e) {
        return this._ctx.store.setSelected(e)
      }, u.prototype.setSelectedCoordinates = function (e) {
        var t = this
        this._ctx.store.setSelectedCoordinates(e), e.reduce(function (e, n) {
          return void 0 === e[n.feature_id] && (e[n.feature_id] = !0, t._ctx.store.get(n.feature_id).changed()), e
        }, {})
      }, u.prototype.getSelected = function () {
        return this._ctx.store.getSelected()
      }, u.prototype.getSelectedIds = function () {
        return this._ctx.store.getSelectedIds()
      }, u.prototype.isSelected = function (e) {
        return this._ctx.store.isSelected(e)
      }, u.prototype.getFeature = function (e) {
        return this._ctx.store.get(e)
      }, u.prototype.select = function (e) {
        return this._ctx.store.select(e)
      }, u.prototype.deselect = function (e) {
        return this._ctx.store.deselect(e)
      }, u.prototype.deleteFeature = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
        return this._ctx.store.delete(e, t)
      }, u.prototype.addFeature = function (e) {
        return this._ctx.store.add(e)
      }, u.prototype.clearSelectedFeatures = function () {
        return this._ctx.store.clearSelected()
      }, u.prototype.clearSelectedCoordinates = function () {
        return this._ctx.store.clearSelectedCoordinates()
      }, u.prototype.setActionableState = function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = {
          trash: e.trash || !1,
          combineFeatures: e.combineFeatures || !1,
          uncombineFeatures: e.uncombineFeatures || !1
        }
        return this._ctx.events.actionable(t)
      }, u.prototype.changeMode = function (e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {}
        return this._ctx.events.changeMode(e, t, n)
      }, u.prototype.updateUIClasses = function (e) {
        return this._ctx.ui.queueMapClasses(e)
      }, u.prototype.activateUIButton = function (e) {
        return this._ctx.ui.setActiveButton(e)
      }, u.prototype.featuresAt = function (e, t) {
        var n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 'click'
        if ('click' !== n && 'touch' !== n) throw new Error('invalid buffer type')
        return r[n](e, t, this._ctx)
      }, u.prototype.newFeature = function (e) {
        var t = e.geometry.type
        return t === o.geojsonTypes.POINT ? new i(this._ctx, e) : t === o.geojsonTypes.LINE_STRING ? new s(this._ctx, e) : t === o.geojsonTypes.POLYGON ? new a(this._ctx, e) : new c(this._ctx, e)
      }, u.prototype.isInstanceOf = function (e, t) {
        if (e === o.geojsonTypes.POINT) return t instanceof i
        if (e === o.geojsonTypes.LINE_STRING) return t instanceof s
        if (e === o.geojsonTypes.POLYGON) return t instanceof a
        if ('MultiFeature' === e) return t instanceof c
        throw new Error('Unknown feature class: ' + e)
      }, u.prototype.doRender = function (e) {
        return this._ctx.store.featureChanged(e)
      }
    }, {
      '../constants': 23,
      '../feature_types/line_string': 26,
      '../feature_types/multi_feature': 27,
      '../feature_types/point': 28,
      '../feature_types/polygon': 29,
      '../lib/features_at': 37
    }],
    59: [function (e, t, n) {
      'use strict'
      var o = e('./mode_interface')
      t.exports = function (e) {
        var t = Object.keys(e)
        return function (n) {
          var r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, i = {},
            s = t.reduce(function (t, n) {
              return t[n] = e[n], t
            }, new o(n))

          function a (e) {
            return function (t) {
              s[e](i, t)
            }
          }

          return {
            start: function () {
              i = s.onSetup(r), this.on('drag', function () {
                return !0
              }, a('onDrag')), this.on('click', function () {
                return !0
              }, a('onClick')), this.on('mousemove', function () {
                return !0
              }, a('onMouseMove')), this.on('mousedown', function () {
                return !0
              }, a('onMouseDown')), this.on('mouseup', function () {
                return !0
              }, a('onMouseUp')), this.on('mouseout', function () {
                return !0
              }, a('onMouseOut')), this.on('keyup', function () {
                return !0
              }, a('onKeyUp')), this.on('keydown', function () {
                return !0
              }, a('onKeyDown')), this.on('touchstart', function () {
                return !0
              }, a('onTouchStart')), this.on('touchmove', function () {
                return !0
              }, a('onTouchMove')), this.on('touchend', function () {
                return !0
              }, a('onTouchEnd')), this.on('tap', function () {
                return !0
              }, a('onTap'))
            }, stop: function () {
              s.onStop(i)
            }, trash: function () {
              s.onTrash(i)
            }, combineFeatures: function () {
              s.onCombineFeatures(i)
            }, uncombineFeatures: function () {
              s.onUncombineFeatures(i)
            }, render: function (e, t) {
              s.toDisplayFeatures(i, e, t)
            }
          }
        }
      }
    }, { './mode_interface': 57 }],
    60: [function (e, t, n) {
      'use strict'
      var o = e('../lib/common_selectors'), r = e('../lib/mouse_event_point'),
        i = e('../lib/create_supplementary_points'), s = e('../lib/string_set'),
        a = e('../lib/double_click_zoom'), c = e('../lib/move_features'), u = e('../constants'), l = {
          onSetup: function (e) {
            var t = this, n = {
              dragMoveLocation: null,
              boxSelectStartLocation: null,
              boxSelectElement: void 0,
              boxSelecting: !1,
              canBoxSelect: !1,
              dragMoveing: !1,
              canDragMove: !1,
              initiallySelectedFeatureIds: e.featureIds || []
            }
            return this.setSelected(n.initiallySelectedFeatureIds.filter(function (e) {
              return void 0 !== t.getFeature(e)
            })), this.fireActionable(), this.setActionableState({
              combineFeatures: !0,
              uncombineFeatures: !0,
              trash: !0
            }), n
          }, fireUpdate: function () {
            this.map.fire(u.events.UPDATE, {
              action: u.updateActions.MOVE,
              features: this.getSelected().map(function (e) {
                return e.toGeoJSON()
              })
            })
          }, fireActionable: function () {
            var e = this, t = this.getSelected(), n = t.filter(function (t) {
              return e.isInstanceOf('MultiFeature', t)
            }), o = !1
            if (t.length > 1) {
              o = !0
              var r = t[0].type.replace('Multi', '')
              t.forEach(function (e) {
                e.type.replace('Multi', '') !== r && (o = !1)
              })
            }
            var i = n.length > 0, s = t.length > 0
            this.setActionableState({ combineFeatures: o, uncombineFeatures: i, trash: s })
          }, getUniqueIds: function (e) {
            return e.length ? e.map(function (e) {
              return e.properties.id
            }).filter(function (e) {
              return void 0 !== e
            }).reduce(function (e, t) {
              return e.add(t), e
            }, new s).values() : []
          }, stopExtendedInteractions: function (e) {
            e.boxSelectElement && (e.boxSelectElement.parentNode && e.boxSelectElement.parentNode.removeChild(e.boxSelectElement), e.boxSelectElement = null), this.map.dragPan.enable(), e.boxSelecting = !1, e.canBoxSelect = !1, e.dragMoving = !1, e.canDragMove = !1
          }, onStop: function () {
            a.enable(this)
          }, onMouseUp: function (e, t) {
            if (o.true(t)) return this.stopExtendedInteractions(e)
          }, onMouseMove: function (e) {
            return this.stopExtendedInteractions(e)
          }, onMouseOut: function (e) {
            if (e.dragMoving) return this.fireUpdate()
          }
        }
      l.onTap = l.onClick = function (e, t) {
        return o.noTarget(t) ? this.clickAnywhere(e, t) : o.isOfMetaType(u.meta.VERTEX)(t) ? this.clickOnVertex(e, t) : o.isFeature(t) ? this.clickOnFeature(e, t) : void 0
      }, l.clickAnywhere = function (e) {
        var t = this, n = this.getSelectedIds()
        n.length && (this.clearSelectedFeatures(), n.forEach(function (e) {
          return t.doRender(e)
        })), a.enable(this), this.stopExtendedInteractions(e)
      }, l.clickOnVertex = function (e, t) {
        this.changeMode(u.modes.DIRECT_SELECT, {
          featureId: t.featureTarget.properties.parent,
          coordPath: t.featureTarget.properties.coord_path,
          startPos: t.lngLat
        }), this.updateUIClasses({ mouse: u.cursors.MOVE })
      }, l.startOnActiveFeature = function (e, t) {
        this.stopExtendedInteractions(e), this.map.dragPan.disable(), this.doRender(t.featureTarget.properties.id), e.canDragMove = !0, e.dragMoveLocation = t.lngLat
      }, l.clickOnFeature = function (e, t) {
        var n = this
        a.disable(this), this.stopExtendedInteractions(e)
        var r = o.isShiftDown(t), i = this.getSelectedIds(), s = t.featureTarget.properties.id,
          c = this.isSelected(s)
        if (!r && c && this.getFeature(s).type !== u.geojsonTypes.POINT) return this.changeMode(u.modes.DIRECT_SELECT, { featureId: s })
        c && r ? (this.deselect(s), this.updateUIClasses({ mouse: u.cursors.POINTER }), 1 === i.length && a.enable(this)) : !c && r ? (this.select(s), this.updateUIClasses({ mouse: u.cursors.MOVE })) : c || r || (i.forEach(function (e) {
          return n.doRender(e)
        }), this.setSelected(s), this.updateUIClasses({ mouse: u.cursors.MOVE })), this.doRender(s)
      }, l.onMouseDown = function (e, t) {
        return o.isActiveFeature(t) ? this.startOnActiveFeature(e, t) : this.drawConfig.boxSelect && o.isShiftMousedown(t) ? this.startBoxSelect(e, t) : void 0
      }, l.startBoxSelect = function (e, t) {
        this.stopExtendedInteractions(e), this.map.dragPan.disable(), e.boxSelectStartLocation = r(t.originalEvent, this.map.getContainer()), e.canBoxSelect = !0
      }, l.onTouchStart = function (e, t) {
        if (o.isActiveFeature(t)) return this.startOnActiveFeature(e, t)
      }, l.onDrag = function (e, t) {
        /*return e.canDragMove ? this.dragMove(e, t) : this.drawConfig.boxSelect && e.canBoxSelect ? this.whileBoxSelect(e, t) : void 0*/
      }, l.whileBoxSelect = function (e, t) {
        e.boxSelecting = !0, this.updateUIClasses({ mouse: u.cursors.ADD }), e.boxSelectElement || (e.boxSelectElement = document.createElement('div'), e.boxSelectElement.classList.add(u.classes.BOX_SELECT), this.map.getContainer().appendChild(e.boxSelectElement))
        var n = r(t.originalEvent, this.map.getContainer()), o = Math.min(e.boxSelectStartLocation.x, n.x),
          i = Math.max(e.boxSelectStartLocation.x, n.x), s = Math.min(e.boxSelectStartLocation.y, n.y),
          a = Math.max(e.boxSelectStartLocation.y, n.y), c = 'translate(' + o + 'px, ' + s + 'px)'
        e.boxSelectElement.style.transform = c, e.boxSelectElement.style.WebkitTransform = c, e.boxSelectElement.style.width = i - o + 'px', e.boxSelectElement.style.height = a - s + 'px'
      }, l.dragMove = function (e, t) {
        e.dragMoving = !0, t.originalEvent.stopPropagation()
        var n = { lng: t.lngLat.lng - e.dragMoveLocation.lng, lat: t.lngLat.lat - e.dragMoveLocation.lat }
        c(this.getSelected(), n), e.dragMoveLocation = t.lngLat
      }, l.onMouseUp = function (e, t) {
        var n = this
        if (e.dragMoving) this.fireUpdate(); else if (e.boxSelecting) {
          var o = [e.boxSelectStartLocation, r(t.originalEvent, this.map.getContainer())],
            i = this.featuresAt(null, o, 'click'), s = this.getUniqueIds(i).filter(function (e) {
              return !n.isSelected(e)
            })
          s.length && (this.select(s), s.forEach(function (e) {
            return n.doRender(e)
          }), this.updateUIClasses({ mouse: u.cursors.MOVE }))
        }
        this.stopExtendedInteractions(e)
      }, l.toDisplayFeatures = function (e, t, n) {
        t.properties.active = this.isSelected(t.properties.id) ? u.activeStates.ACTIVE : u.activeStates.INACTIVE, n(t), this.fireActionable(), t.properties.active === u.activeStates.ACTIVE && t.geometry.type !== u.geojsonTypes.POINT && i(t).forEach(n)
      }, l.onTrash = function () {
        this.deleteFeature(this.getSelectedIds()), this.fireActionable()
      }, l.onCombineFeatures = function () {
        var e = this.getSelected()
        if (!(0 === e.length || e.length < 2)) {
          for (var t = [], n = [], o = e[0].type.replace('Multi', ''), r = 0; r < e.length; r++) {
            var i = e[r]
            if (i.type.replace('Multi', '') !== o) return
            i.type.includes('Multi') ? i.getCoordinates().forEach(function (e) {
              t.push(e)
            }) : t.push(i.getCoordinates()), n.push(i.toGeoJSON())
          }
          if (n.length > 1) {
            var s = this.newFeature({
              type: u.geojsonTypes.FEATURE,
              properties: n[0].properties,
              geometry: { type: 'Multi' + o, coordinates: t }
            })
            this.addFeature(s), this.deleteFeature(this.getSelectedIds(), { silent: !0 }), this.setSelected([s.id]), this.map.fire(u.events.COMBINE_FEATURES, {
              createdFeatures: [s.toGeoJSON()],
              deletedFeatures: n
            })
          }
          this.fireActionable()
        }
      }, l.onUncombineFeatures = function () {
        var e = this, t = this.getSelected()
        if (0 !== t.length) {
          for (var n = [], o = [], r = function (r) {
            var i = t[r]
            e.isInstanceOf('MultiFeature', i) && (i.getFeatures().forEach(function (t) {
              e.addFeature(t), t.properties = i.properties, n.push(t.toGeoJSON()), e.select([t.id])
            }), e.deleteFeature(i.id, { silent: !0 }), o.push(i.toGeoJSON()))
          }, i = 0; i < t.length; i++) r(i)
          n.length > 1 && this.map.fire(u.events.UNCOMBINE_FEATURES, {
            createdFeatures: n,
            deletedFeatures: o
          }), this.fireActionable()
        }
      }, t.exports = l
    }, {
      '../constants': 23,
      '../lib/common_selectors': 30,
      '../lib/create_supplementary_points': 33,
      '../lib/double_click_zoom': 35,
      '../lib/mouse_event_point': 44,
      '../lib/move_features': 45,
      '../lib/string_set': 47
    }],
    61: [function (e, t, n) {
      'use strict'
      var o = e('xtend'), r = e('./constants'), i = {
        defaultMode: r.modes.SIMPLE_SELECT,
        keybindings: !0,
        touchEnabled: !0,
        clickBuffer: 2,
        touchBuffer: 25,
        boxSelect: !0,
        displayControlsDefault: !0,
        styles: e('./lib/theme'),
        modes: e('./modes'),
        controls: {},
        userProperties: !1
      }, s = { point: !0, line_string: !0, polygon: !0, trash: !0, combine_features: !0, uncombine_features: !0 },
        a = { point: !1, line_string: !1, polygon: !1, trash: !1, combine_features: !1, uncombine_features: !1 }

      function c (e, t) {
        return e.map(function (e) {
          return e.source ? e : o(e, {
            id: e.id + '.' + t,
            source: 'hot' === t ? r.sources.HOT : r.sources.COLD
          })
        })
      }

      t.exports = function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = o(e)
        return e.controls || (t.controls = {}), !1 === e.displayControlsDefault ? t.controls = o(a, e.controls) : t.controls = o(s, e.controls), (t = o(i, t)).styles = c(t.styles, 'cold').concat(c(t.styles, 'hot')), t
      }
    }, { './constants': 23, './lib/theme': 49, './modes': 56, xtend: 21 }],
    62: [function (e, t, n) {
      'use strict'
      var o = e('./constants')
      t.exports = function () {
        var e = this
        if (!(e.ctx.map && void 0 !== e.ctx.map.getSource(o.sources.HOT))) return u()
        var t = e.ctx.events.currentModeName()
        e.ctx.ui.queueMapClasses({ mode: t })
        var n = [], r = []
        e.isDirty ? r = e.getAllIds() : (n = e.getChangedIds().filter(function (t) {
          return void 0 !== e.get(t)
        }), r = e.sources.hot.filter(function (t) {
          return t.properties.id && -1 === n.indexOf(t.properties.id) && void 0 !== e.get(t.properties.id)
        }).map(function (e) {
          return e.properties.id
        })), e.sources.hot = []
        var i = e.sources.cold.length
        e.sources.cold = e.isDirty ? [] : e.sources.cold.filter(function (e) {
          var t = e.properties.id || e.properties.parent
          return -1 === n.indexOf(t)
        })
        var s = i !== e.sources.cold.length || r.length > 0

        function a (n, o) {
          var r = e.get(n).internal(t)
          e.ctx.events.currentModeRender(r, function (t) {
            e.sources[o].push(t)
          })
        }

        if (n.forEach(function (e) {
          return a(e, 'hot')
        }), r.forEach(function (e) {
          return a(e, 'cold')
        }), s && e.ctx.map.getSource(o.sources.COLD).setData({
          type: o.geojsonTypes.FEATURE_COLLECTION,
          features: e.sources.cold
        }), e.ctx.map.getSource(o.sources.HOT).setData({
          type: o.geojsonTypes.FEATURE_COLLECTION,
          features: e.sources.hot
        }), e._emitSelectionChange && (e.ctx.map.fire(o.events.SELECTION_CHANGE, {
          features: e.getSelected().map(function (e) {
            return e.toGeoJSON()
          }), points: e.getSelectedCoordinates().map(function (e) {
            return {
              type: o.geojsonTypes.FEATURE,
              properties: {},
              geometry: { type: o.geojsonTypes.POINT, coordinates: e.coordinates }
            }
          })
        }), e._emitSelectionChange = !1), e._deletedFeaturesToEmit.length) {
          var c = e._deletedFeaturesToEmit.map(function (e) {
            return e.toGeoJSON()
          })
          e._deletedFeaturesToEmit = [], e.ctx.map.fire(o.events.DELETE, { features: c })
        }

        function u () {
          e.isDirty = !1, e.clearChangedIds()
        }

        u(), e.ctx.map.fire(o.events.RENDER, {})
      }
    }, { './constants': 23 }],
    63: [function (e, t, n) {
      'use strict'
      var o = e('./events'), r = e('./store'), i = e('./ui'), s = e('./constants'), a = e('xtend')
      t.exports = function (e) {
        var t = null, n = null, c = {
          onRemove: function () {
            return e.map.off('load', c.connect), clearInterval(n), c.removeLayers(), e.store.restoreMapConfig(), e.ui.removeButtons(), e.events.removeEventListeners(), e.map = null, e.container = null, e.store = null, t && t.parentNode && t.parentNode.removeChild(t), t = null, this
          }, connect: function () {
            e.map.off('load', c.connect), clearInterval(n), c.addLayers(), e.store.storeMapConfig(), e.events.addEventListeners()
          }, onAdd: function (s) {
            var u = s.fire
            return s.fire = function (e, t) {
              var n = arguments
              return 1 === u.length && 1 !== arguments.length && (n = [a({}, { type: e }, t)]), u.apply(s, n)
            }, e.map = s, e.events = o(e), e.ui = i(e), e.container = s.getContainer(), e.store = new r(e), t = e.ui.addButtons(), e.options.boxSelect && (s.boxZoom.disable(), s.dragPan.disable(), s.dragPan.enable()), s.loaded() ? c.connect() : (s.on('load', c.connect), n = setInterval(function () {
              s.loaded() && c.connect()
            }, 16)), e.events.start(), t
          }, addLayers: function () {
            e.map.addSource(s.sources.COLD, {
              data: { type: s.geojsonTypes.FEATURE_COLLECTION, features: [] },
              type: 'geojson'
            }), e.map.addSource(s.sources.HOT, {
              data: {
                type: s.geojsonTypes.FEATURE_COLLECTION,
                features: []
              }, type: 'geojson'
            }), e.options.styles.forEach(function (t) {
              e.map.addLayer(t)
            }), e.store.setDirty(!0), e.store.render()
          }, removeLayers: function () {
            e.options.styles.forEach(function (t) {
              e.map.getLayer(t.id) && e.map.removeLayer(t.id)
            }), e.map.getSource(s.sources.COLD) && e.map.removeSource(s.sources.COLD), e.map.getSource(s.sources.HOT) && e.map.removeSource(s.sources.HOT)
          }
        }
        return e.setup = c, c
      }
    }, { './constants': 23, './events': 24, './store': 64, './ui': 65, xtend: 21 }],
    64: [function (e, t, n) {
      'use strict'
      var o = e('./lib/throttle'), r = e('./lib/to_dense_array'), i = e('./lib/string_set'), s = e('./render'),
        a = e('./constants').interactions, c = t.exports = function (e) {
          this._features = {}, this._featureIds = new i, this._selectedFeatureIds = new i, this._selectedCoordinates = [], this._changedFeatureIds = new i, this._deletedFeaturesToEmit = [], this._emitSelectionChange = !1, this._mapInitialConfig = {}, this.ctx = e, this.sources = {
            hot: [],
            cold: []
          }, this.render = o(s, 16, this), this.isDirty = !1
        }

      function u (e) {
        var t = this, n = this._selectedCoordinates.filter(function (e) {
          return t._selectedFeatureIds.has(e.feature_id)
        })
        this._selectedCoordinates.length === n.length || e.silent || (this._emitSelectionChange = !0), this._selectedCoordinates = n
      }

      c.prototype.createRenderBatch = function () {
        var e = this, t = this.render, n = 0
        return this.render = function () {
          n++
        }, function () {
          e.render = t, n > 0 && e.render()
        }
      }, c.prototype.setDirty = function () {
        return this.isDirty = !0, this
      }, c.prototype.featureChanged = function (e) {
        return this._changedFeatureIds.add(e), this
      }, c.prototype.getChangedIds = function () {
        return this._changedFeatureIds.values()
      }, c.prototype.clearChangedIds = function () {
        return this._changedFeatureIds.clear(), this
      }, c.prototype.getAllIds = function () {
        return this._featureIds.values()
      }, c.prototype.add = function (e) {
        return this.featureChanged(e.id), this._features[e.id] = e, this._featureIds.add(e.id), this
      }, c.prototype.delete = function (e) {
        var t = this, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
        return r(e).forEach(function (e) {
          t._featureIds.has(e) && (t._featureIds.delete(e), t._selectedFeatureIds.delete(e), n.silent || -1 === t._deletedFeaturesToEmit.indexOf(t._features[e]) && t._deletedFeaturesToEmit.push(t._features[e]), delete t._features[e], t.isDirty = !0)
        }), u.call(this, n), this
      }, c.prototype.get = function (e) {
        return this._features[e]
      }, c.prototype.getAll = function () {
        var e = this
        return Object.keys(this._features).map(function (t) {
          return e._features[t]
        })
      }, c.prototype.select = function (e) {
        var t = this, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
        return r(e).forEach(function (e) {
          t._selectedFeatureIds.has(e) || (t._selectedFeatureIds.add(e), t._changedFeatureIds.add(e), n.silent || (t._emitSelectionChange = !0))
        }), this
      }, c.prototype.deselect = function (e) {
        var t = this, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
        return r(e).forEach(function (e) {
          t._selectedFeatureIds.has(e) && (t._selectedFeatureIds.delete(e), t._changedFeatureIds.add(e), n.silent || (t._emitSelectionChange = !0))
        }), u.call(this, n), this
      }, c.prototype.clearSelected = function () {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}
        return this.deselect(this._selectedFeatureIds.values(), { silent: e.silent }), this
      }, c.prototype.setSelected = function (e) {
        var t = this, n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}
        return e = r(e), this.deselect(this._selectedFeatureIds.values().filter(function (t) {
          return -1 === e.indexOf(t)
        }), { silent: n.silent }), this.select(e.filter(function (e) {
          return !t._selectedFeatureIds.has(e)
        }), { silent: n.silent }), this
      }, c.prototype.setSelectedCoordinates = function (e) {
        return this._selectedCoordinates = e, this._emitSelectionChange = !0, this
      }, c.prototype.clearSelectedCoordinates = function () {
        return this._selectedCoordinates = [], this._emitSelectionChange = !0, this
      }, c.prototype.getSelectedIds = function () {
        return this._selectedFeatureIds.values()
      }, c.prototype.getSelected = function () {
        var e = this
        return this._selectedFeatureIds.values().map(function (t) {
          return e.get(t)
        })
      }, c.prototype.getSelectedCoordinates = function () {
        var e = this
        return this._selectedCoordinates.map(function (t) {
          return { coordinates: e.get(t.feature_id).getCoordinate(t.coord_path) }
        })
      }, c.prototype.isSelected = function (e) {
        return this._selectedFeatureIds.has(e)
      }, c.prototype.setFeatureProperty = function (e, t, n) {
        this.get(e).setProperty(t, n), this.featureChanged(e)
      }, c.prototype.storeMapConfig = function () {
        var e = this
        a.forEach(function (t) {
          e.ctx.map[t] && (e._mapInitialConfig[t] = e.ctx.map[t].isEnabled())
        })
      }, c.prototype.restoreMapConfig = function () {
        var e = this
        Object.keys(this._mapInitialConfig).forEach(function (t) {
          e._mapInitialConfig[t] ? e.ctx.map[t].enable() : e.ctx.map[t].disable()
        })
      }, c.prototype.getInitialConfigValue = function (e) {
        return void 0 === this._mapInitialConfig[e] || this._mapInitialConfig[e]
      }
    }, {
      './constants': 23,
      './lib/string_set': 47,
      './lib/throttle': 50,
      './lib/to_dense_array': 51,
      './render': 62
    }],
    65: [function (e, t, n) {
      'use strict'
      var o = e('xtend'), r = e('./constants'), i = ['mode', 'feature', 'mouse']
      t.exports = function (e) {
        var t = {}, n = null, s = { mode: null, feature: null, mouse: null },
          a = { mode: null, feature: null, mouse: null }

        function c (e) {
          var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
            o = document.createElement('button')
          return o.className = r.classes.CONTROL_BUTTON + ' ' + t.className, o.setAttribute('title', t.tooltip), t.container.appendChild(o), o.addEventListener('click', function (o) {
            o.preventDefault(), o.stopPropagation(), o.target !== n ? (l(e), t.onActivate()) : u()
          }, !0), o
        }

        function u () {
          n && (n.classList.remove(r.classes.ACTIVE_BUTTON), n = null)
        }

        function l (e) {
          u()
          var o = t[e]
          o && o && 'trash' !== e && (o.classList.add(r.classes.ACTIVE_BUTTON), n = o)
        }

        return {
          setActiveButton: l, queueMapClasses: function (e) {
            a = o(a, e)
          }, updateMapClasses: function () {
            if (e.container) {
              var t = [], n = []
              i.forEach(function (e) {
                a[e] !== s[e] && (t.push(e + '-' + s[e]), null !== a[e] && n.push(e + '-' + a[e]))
              }), t.length > 0 && e.container.classList.remove.apply(e.container.classList, t), n.length > 0 && e.container.classList.add.apply(e.container.classList, n), s = o(s, a)
            }
          }, addButtons: function () {
            var n = e.options.controls, o = document.createElement('div')
            return o.className = r.classes.CONTROL_GROUP + ' ' + r.classes.CONTROL_BASE, n ? (n[r.types.LINE] && (t[r.types.LINE] = c(r.types.LINE, {
              container: o,
              className: r.classes.CONTROL_BUTTON_LINE,
              tooltip: '测距',
              onActivate: function () {
                return e.events.changeMode(r.modes.DRAW_LINE_STRING)
              }
            })), n[r.types.POLYGON] && (t[r.types.POLYGON] = c(r.types.POLYGON, {
              container: o,
              className: r.classes.CONTROL_BUTTON_POLYGON,
              tooltip: '测面',
              onActivate: function () {
                return e.events.changeMode(r.modes.DRAW_POLYGON)
              }
            })), n[r.types.POINT] && (t[r.types.POINT] = c(r.types.POINT, {
              container: o,
              className: r.classes.CONTROL_BUTTON_POINT,
              tooltip: 'Marker tool ' + (e.options.keybindings ? '(m)' : ''),
              onActivate: function () {
                return e.events.changeMode(r.modes.DRAW_POINT)
              }
            })), n.trash && (t.trash = c('trash', {
              container: o,
              className: r.classes.CONTROL_BUTTON_TRASH,
              tooltip: '删除量测',
              onActivate: function () {
                e.events.trash()
              }
            })), n.combine_features && (t.combine_features = c('combineFeatures', {
              container: o,
              className: r.classes.CONTROL_BUTTON_COMBINE_FEATURES,
              tooltip: 'Combine',
              onActivate: function () {
                e.events.combineFeatures()
              }
            })), n.uncombine_features && (t.uncombine_features = c('uncombineFeatures', {
              container: o,
              className: r.classes.CONTROL_BUTTON_UNCOMBINE_FEATURES,
              tooltip: 'Uncombine',
              onActivate: function () {
                e.events.uncombineFeatures()
              }
            })), o) : o
          }, removeButtons: function () {
            Object.keys(t).forEach(function (e) {
              var n = t[e]
              n.parentNode && n.parentNode.removeChild(n), delete t[e]
            })
          }
        }
      }
    }, { './constants': 23, xtend: 21 }]
  }, {}, [1])(1)
})