// fxc: ReShade .fx -> GLSL (reshadefx, BSD-3). Saída: <out>.glsl + <out>.json (teknik/pass/tekstur/uniform)
#include "effect_parser.hpp"
#include "effect_preprocessor.hpp"
#include "effect_codegen.hpp"
#include <fstream>
#include <iostream>
#include <sstream>
#include <memory>
static std::string esc(const std::string& s){std::string o;for(char c:s){if(c=='"'||c=='\\'){o+='\\';o+=c;}else if(c=='\n')o+="\\n";else if(c>=0&&c<32)o+=' ';else o+=c;}return o;}
int main(int argc,char**argv){
  if(argc<3){std::cerr<<"uso: fxc in.fx outprefix [-I dir] [-D NAME=VAL]...\n";return 2;}
  reshadefx::preprocessor pp;
  pp.add_macro_definition("__RESHADE__","60000");
  pp.add_macro_definition("__RESHADE_PERFORMANCE_MODE__","0");
  pp.add_macro_definition("__RENDERER__","196608");
  pp.add_macro_definition("__VENDOR__","0");pp.add_macro_definition("__DEVICE__","0");pp.add_macro_definition("__APPLICATION__","0");
  std::string W="1920",H="1080";
  for(int i=3;i<argc;i++){std::string a=argv[i];
    if(a=="-I"&&i+1<argc)pp.add_include_path(argv[++i]);
    else if(a=="-D"&&i+1<argc){std::string d=argv[++i];auto e=d.find('=');pp.add_macro_definition(d.substr(0,e),e==std::string::npos?"1":d.substr(e+1));if(d.substr(0,e)=="BUFFER_WIDTH")W=d.substr(e+1);if(d.substr(0,e)=="BUFFER_HEIGHT")H=d.substr(e+1);}}
  pp.add_macro_definition("BUFFER_WIDTH",W);pp.add_macro_definition("BUFFER_HEIGHT",H);
  pp.add_macro_definition("BUFFER_RCP_WIDTH","(1.0 / BUFFER_WIDTH)");pp.add_macro_definition("BUFFER_RCP_HEIGHT","(1.0 / BUFFER_HEIGHT)");
  pp.add_macro_definition("BUFFER_COLOR_SPACE","1");pp.add_macro_definition("BUFFER_COLOR_FORMAT","8");pp.add_macro_definition("BUFFER_COLOR_BIT_DEPTH","8");
  if(!pp.append_file(argv[1])){std::cerr<<"preprocessor: "<<pp.errors()<<"\n";return 1;}
  if(!pp.errors().empty())std::cerr<<pp.errors();
  std::unique_ptr<reshadefx::codegen> cg(reshadefx::create_codegen_glsl(false,false,false,false,true));
  reshadefx::parser ps;
  bool ok=ps.parse(pp.output(),cg.get());
  std::cerr<<ps.errors();
  if(!ok){std::cerr<<"parse GAGAL\n";return 1;}
  const reshadefx::effect_module m=cg->module();
  std::string pre=argv[2];
  std::ofstream(pre+".glsl")<<cg->finalize_code();
  std::ostringstream j;
  j<<"{\"techniques\":[";
  for(size_t t=0;t<m.techniques.size();t++){auto&q=m.techniques[t];j<<(t?",":"")<<"{\"name\":\""<<esc(q.name)<<"\",\"passes\":[";
    for(size_t p=0;p<q.passes.size();p++){auto&s=q.passes[p];j<<(p?",":"")<<"{\"vs\":\""<<esc(s.vs_entry_point)<<"\",\"ps\":\""<<esc(s.ps_entry_point)<<"\",\"w\":"<<s.viewport_width<<",\"h\":"<<s.viewport_height<<",\"clear\":"<<(s.clear_render_targets?1:0)<<",\"srgb\":"<<(s.srgb_write_enable?1:0)<<",\"rt\":[";
      for(int r=0;r<8;r++)j<<(r?",":"")<<"\""<<esc(s.render_target_names[r])<<"\"";
      j<<"],\"samplers\":[";
      for(size_t k=0;k<s.sampler_bindings.size();k++)j<<(k?",":"")<<"{\"index\":"<<s.sampler_bindings[k].index<<",\"binding\":"<<s.sampler_bindings[k].entry_point_binding<<"}";
      j<<"]}";}
    j<<"]}";}
  j<<"],\"textures\":[";
  for(size_t t=0;t<m.textures.size();t++){auto&x=m.textures[t];j<<(t?",":"")<<"{\"name\":\""<<esc(x.unique_name)<<"\",\"w\":"<<x.width<<",\"h\":"<<x.height<<",\"levels\":"<<x.levels<<",\"fmt\":"<<(int)x.format<<",\"semantic\":\""<<esc(x.semantic)<<"\"}";}
  j<<"],\"samplers\":[";
  for(size_t t=0;t<m.samplers.size();t++){auto&x=m.samplers[t];j<<(t?",":"")<<"{\"name\":\""<<esc(x.unique_name)<<"\",\"tex\":\""<<esc(x.texture_name)<<"\",\"filter\":"<<(int)x.filter<<",\"srgb\":"<<(x.srgb?1:0)<<"}";}
  j<<"],\"uniforms\":[";
  auto annJson=[&](const std::vector<reshadefx::annotation>&an,std::ostream&o){
    o<<"{";bool first=true;
    for(auto&a:an){o<<(first?"":",")<<"\""<<esc(a.name)<<"\":";first=false;
      if(a.type.base==reshadefx::type::t_string){
        // ui_items usa '\0' como separador: exporta como "\n"
        std::string v=a.value.string_data;for(auto&c:v)if(c==0)c='\n';
        o<<"\""<<esc(v)<<"\"";
      } else {
        int n=a.type.components();if(n<1)n=1;
        o<<"[";
        for(int c=0;c<n;c++){o<<(c?",":"");
          if(a.type.is_floating_point())o<<a.value.as_float[c];else o<<a.value.as_int[c];}
        o<<"]";}
    }
    o<<"}";};
  for(size_t t=0;t<m.uniforms.size();t++){auto&x=m.uniforms[t];
    j<<(t?",":"")<<"{\"name\":\""<<esc(x.name)<<"\",\"offset\":"<<x.offset<<",\"size\":"<<x.size<<",\"rows\":"<<x.type.rows<<",\"cols\":"<<x.type.cols<<",\"base\":"<<(int)x.type.base<<",\"float\":"<<(x.type.is_floating_point()?1:0)<<",\"bool\":"<<(x.type.base==reshadefx::type::t_bool?1:0)<<",\"def\":[";
    for(int c=0;c<16&&c<(int)(x.type.rows*x.type.cols);c++){j<<(c?",":"");
      if(x.type.is_floating_point())j<<x.initializer_value.as_float[c];else j<<x.initializer_value.as_int[c];}
    j<<"],\"ann\":";annJson(x.annotations,j);j<<"}";}
  j<<"],\"tech_ann\":[";
  for(size_t t=0;t<m.techniques.size();t++){j<<(t?",":"");annJson(m.techniques[t].annotations,j);}
  j<<"],\"total_uniform_size\":"<<m.total_uniform_size<<"}";
  std::ofstream(pre+".json")<<j.str();
  std::cerr<<"OK techniques="<<m.techniques.size()<<" textures="<<m.textures.size()<<" uniforms="<<m.uniforms.size()<<"\n";
  return 0;}
