package org.json;
import java.util.*;
public class JSONArray {
    final List<Object> l = new ArrayList<>();
    public JSONArray() {}
    public JSONArray(String s) throws JSONException { Object o = new P(s).val(); if (!(o instanceof JSONArray)) throw new JSONException("not array"); l.addAll(((JSONArray) o).l); }
    public int length() { return l.size(); }
    public Object get(int i) throws JSONException { if (i < 0 || i >= l.size()) throw new JSONException("idx"); return l.get(i); }
    public JSONObject getJSONObject(int i) throws JSONException { Object o = get(i); if (o instanceof JSONObject) return (JSONObject) o; throw new JSONException("obj"); }
    public String getString(int i) throws JSONException { return String.valueOf(get(i)); }
    public double optDouble(int i, double d) { try { Object o = get(i); return o instanceof Number ? ((Number) o).doubleValue() : d; } catch (JSONException e) { return d; } }
}
