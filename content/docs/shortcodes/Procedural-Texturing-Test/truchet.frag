#ifdef GL_ES
precision mediump float;
#endif
#define PI 3.14159265359
#define TWO_PI 6.28318530718
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_zoom, u_rotater;
uniform float v1,v2;
uniform int option;
uniform vec2 u_mouse;



float shape(vec2 st, float N){
    st = st*2.-1.;
    float a = atan(st.x,st.y)+PI;
    float r = TWO_PI/N;
    return abs(cos(floor(.5+a/r)*r-a)*length(st));
}

float box2(vec2 st, vec2 size){
    return shape(st*size,u_rotater);
}

float rect(vec2 _st, vec2 _size){
    _size = vec2(0.5)-_size*0.5;
    vec2 uv = smoothstep(_size,_size+vec2(1e-4),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    return uv.x*uv.y;
}

float hex(vec2 st, float a, float b, float c, float d, float e, float f){
    st = st*vec2(2.,6.);

    vec2 fpos = fract(st);
    vec2 ipos = floor(st);

    if (ipos.x == 1.0) fpos.x = 1.-fpos.x;
    if (ipos.y < 1.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),a);
    } else if (ipos.y < 2.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),b);
    } else if (ipos.y < 3.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),c);
    } else if (ipos.y < 4.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),d);
    } else if (ipos.y < 5.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),e);
    } else if (ipos.y < 6.0){
        return mix(box2(fpos, vec2(0.84,1.)),box2(fpos-vec2(0.03,0.),vec2(1.)),f);
    }
    return 0.0;
}

float hex(vec2 st, float N){
    float b[6];
    float remain = floor(mod(N,64.));
    for(int i = 0; i < 6; i++){
        b[i] = 0.0;
        b[i] = step(1.0,mod(remain,2.));
        remain = ceil(remain/2.);
    }
    return hex(st,b[0],b[1],b[2],b[3],b[4],b[5]);
}

vec2 mirrorTile(vec2 _st, float _zoom){
    _st *= _zoom;
    if (fract(_st.y * 0.5) > 0.5){
        _st.x = _st.x+0.5;
        _st.y = 1.0-_st.y;
    }
    return fract(_st);
}

float fillY(vec2 _st, float _pct,float _antia){
  return  smoothstep( _pct-_antia, _pct, _st.y);
}
vec2 brickTile(vec2 _st, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    _st.x += step(1., mod(_st.y,4.0)) * 0.5;

    return fract(_st);
}

float box(vec2 _st, vec2 _size){
    _size = vec2(0.5)-(u_zoom*0.05);
    vec2 uv = smoothstep(_size,_size+vec2(1e-2),_st);
    uv *= smoothstep(_size,_size+vec2(1e-4),vec2(1.0)-_st);
    if(option==0){
    return uv.x*uv.y;}
    else if(option==2)
    {
        return uv.x+uv.y;
    }else if(option==3)
    {
        return uv.x-uv.y;
    }
}

void main(void){
if (option == 1){
     vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.y *= u_resolution.y/u_resolution.x;

    st *= u_zoom;
    vec2 fpos = fract(st);
    vec2 ipos = floor(st);

    float t = u_time*u_rotater;
    float df = 1.0;
    df = hex(fpos,ipos.x+ipos.y+t)+(1.0-rect(fpos,vec2(0.7)));

    gl_FragColor = vec4(mix(vec3(0.),vec3(0.9),step(0.7,df)),1.0);
}
else if(option ==4){
        vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec3 color = vec3(0.0);

  st = mirrorTile(st*vec2(1.,2.),5.);
  float x = st.x*u_zoom;
  float a = floor(1.+sin(x*u_rotater));
  float b = floor(1.+sin((x+1.)*3.14));
  float f = fract(x);

  color = vec3( fillY(st,mix(a,b,f),0.01) );

   gl_FragColor = vec4(v2,v1,color);
    }
    else {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(1.5);
    st = brickTile(st,u_rotater);
    color = vec3(box(st,vec2(v1)));
    gl_FragColor = vec4(v2,v1,color);
    }
}
