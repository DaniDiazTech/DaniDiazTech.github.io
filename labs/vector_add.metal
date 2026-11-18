#include <metal_stdlib>
using namespace metal;
kernel void vector_add(device const float* a [[buffer(0)]],
                       device const float* b [[buffer(1)]],
                       device float* out [[buffer(2)]],
                       constant uint& n [[buffer(3)]],
                       uint tid [[thread_position_in_grid]]) {
    if(tid<n) out[tid]=a[tid]+b[tid];
}
