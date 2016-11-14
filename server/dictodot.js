module.exports = function(dict){
  let dot = 'digraph G{\n'
  for(let node in dict){
    dict[node].forEach(child=>{
      dot += '"' + node + '" -> "' + child + '"\n'
    })
  }
  dot += '}'
  return dot
}
