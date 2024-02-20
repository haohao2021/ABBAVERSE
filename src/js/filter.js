// 保存全部数据用于后续处理
let globalSongsData;

// 加载 CSV 文件并处理数据
d3.csv("/src/data/database.csv").then(data => {
  globalSongsData = data; // 保存数据到全局变量
  let songNames = new Set(data.map(row => row.Original)); // 提取唯一的歌曲名称

  let songsListContainer = d3.select("#songs-list");
  songsListContainer
    .selectAll("div")
    .data(Array.from(songNames)) // 将 Set 转换为数组
    .enter()
    .append("div")
    .classed("song-item", true)
    .text(d => d)
    .on("click", function(event, d) {
      // 点击歌曲时的处理逻辑
      let coveredCountries = getCoveredCountriesBySong(d, globalSongsData);
      updateMapWithSongData(coveredCountries);
    });
});

// 根据选定的歌曲名称提取翻唱该歌曲的所有国家
function getCoveredCountriesBySong(songName, songsData) {
  // 过滤出该歌曲的所有记录
  return songsData
    .filter(row => row.Original === songName)
    .map(row => row["Artist Country"]);
}

// 更新地图来显示选定歌曲的翻唱信息
function updateMapWithSongData(coveredCountries) {
  // 计算每个国家的翻唱次数
  let countryCounts = countCoveredCountries(coveredCountries);

  
  let minimum = Math.min(...Object.values(countryCounts));
  let maximum = Math.max(...Object.values(countryCounts));

  // 调用 map.js 中的 updateMap 函数更新地图
  updateMap(countryCounts, minimum, maximum);
}

// 统计每个国家的翻唱次数
function countCoveredCountries(coveredCountries) {
  let counts = {};
  coveredCountries.forEach(country => {
    counts[country] = (counts[country] || 0) + 1;
  });
  return counts;
}


