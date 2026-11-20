package org.json;
class P {
    final String s; int i = 0;
    P(String s) { this.s = s; }
    void ws() { while (i < s.length() && Character.isWhitespace(s.charAt(i))) i++; }
    Object val() throws JSONException {
        ws();
        char c = s.charAt(i);
        if (c == '{') { i++; JSONObject o = new JSONObject(); ws(); if (s.charAt(i) == '}') { i++; return o; }
            while (true) { ws(); String k = (String) val(); ws(); i++; Object v = val(); o.m.put(k, v); ws(); char d = s.charAt(i++); if (d == '}') return o; } }
        if (c == '[') { i++; JSONArray a = new JSONArray(); ws(); if (s.charAt(i) == ']') { i++; return a; }
            while (true) { a.l.add(val()); ws(); char d = s.charAt(i++); if (d == ']') return a; } }
        if (c == '"') { i++; StringBuilder b = new StringBuilder();
            while (true) { char d = s.charAt(i++); if (d == '"') return b.toString();
                if (d == '\\') { char e = s.charAt(i++); if (e == 'n') b.append('\n'); else if (e == 'u') { b.append((char) Integer.parseInt(s.substring(i, i + 4), 16)); i += 4; } else b.append(e); } else b.append(d); } }
        if (s.startsWith("true", i)) { i += 4; return Boolean.TRUE; }
        if (s.startsWith("false", i)) { i += 5; return Boolean.FALSE; }
        if (s.startsWith("null", i)) { i += 4; return null; }
        int j = i; while (j < s.length() && "+-.0123456789eE".indexOf(s.charAt(j)) >= 0) j++;
        double d = Double.parseDouble(s.substring(i, j)); i = j; return d;
    }
}
