package org.json;
import java.util.*;
public class JSONObject {
    final Map<String, Object> m = new LinkedHashMap<>();
    public JSONObject() {}
    public JSONObject(String s) throws JSONException { Object o = new P(s).val(); if (!(o instanceof JSONObject)) throw new JSONException("not object"); m.putAll(((JSONObject) o).m); }
    public boolean has(String k) { return m.containsKey(k); }
    public JSONArray getJSONArray(String k) throws JSONException { Object o = m.get(k); if (o instanceof JSONArray) return (JSONArray) o; throw new JSONException(k); }
    public JSONArray optJSONArray(String k) { Object o = m.get(k); return o instanceof JSONArray ? (JSONArray) o : null; }
    public JSONObject getJSONObject(String k) throws JSONException { Object o = m.get(k); if (o instanceof JSONObject) return (JSONObject) o; throw new JSONException(k); }
    public String getString(String k) throws JSONException { Object o = m.get(k); if (o == null) throw new JSONException(k); return String.valueOf(o); }
    public String optString(String k, String d) { Object o = m.get(k); return o == null ? d : String.valueOf(o); }
    public int optInt(String k, int d) { Object o = m.get(k); return o instanceof Number ? ((Number) o).intValue() : d; }
    public double optDouble(String k, double d) { Object o = m.get(k); return o instanceof Number ? ((Number) o).doubleValue() : d; }
}
