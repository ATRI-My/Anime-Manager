// 类型在函数签名中使用，不需要显式导入
// Anime和Episode类型通过any参数隐式使用

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateAnime(anime: any): ValidationResult {
  const errors: string[] = [];

  // 检查必填字段
  if (!anime.id || typeof anime.id !== 'string' || anime.id.trim() === '') {
    errors.push('id不能为空');
  }

  if (!anime.title || typeof anime.title !== 'string' || anime.title.trim() === '') {
    errors.push('标题不能为空');
  }

  if (!anime.watchMethod || typeof anime.watchMethod !== 'string' || anime.watchMethod.trim() === '') {
    errors.push('watchMethod是必填字段');
  }

  // 检查tags字段
  if (!Array.isArray(anime.tags)) {
    errors.push('tags必须是数组');
  }

  // 检查episodes字段
  if (!Array.isArray(anime.episodes)) {
    errors.push('episodes必须是数组');
  } else {
    // 验证每个episode
    const episodeErrors: string[] = [];
    const episodeNumbers = new Set<number>();
    
    for (const episode of anime.episodes) {
      const episodeResult = validateEpisode(episode);
      if (!episodeResult.isValid) {
        episodeErrors.push(...episodeResult.errors);
      }
      
      // 检查剧集编号重复
      if (episode.number !== undefined) {
        if (episodeNumbers.has(episode.number)) {
          episodeErrors.push(`剧集编号 ${episode.number} 重复`);
        }
        episodeNumbers.add(episode.number);
      }
    }
    
    if (episodeErrors.length > 0) {
      errors.push('episodes包含无效数据: ' + episodeErrors.join('; '));
    }
  }

  // 检查日期字段
  if (!anime.createdAt || typeof anime.createdAt !== 'string') {
    errors.push('createdAt是必填字段');
  }

  if (!anime.updatedAt || typeof anime.updatedAt !== 'string') {
    errors.push('updatedAt是必填字段');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function validateEpisode(episode: any): ValidationResult {
  const errors: string[] = [];

  // 检查必填字段
  if (!episode.id || typeof episode.id !== 'string' || episode.id.trim() === '') {
    errors.push('id是必填字段');
  }

  if (episode.number === undefined || typeof episode.number !== 'number') {
    errors.push('剧集编号是必填字段');
  } else if (episode.number <= 0) {
    errors.push('剧集编号必须大于0');
  } else if (!Number.isInteger(episode.number)) {
    errors.push('剧集编号必须是整数');
  }

  if (!episode.title || typeof episode.title !== 'string' || episode.title.trim() === '') {
    errors.push('标题不能为空');
  }

  if (!episode.url || typeof episode.url !== 'string' || episode.url.trim() === '') {
    errors.push('url是必填字段');
  } else {
    const urlStr = episode.url.trim();
    
    // 检查是否是本地文件路径
    const isLocalFile = urlStr.startsWith('file://') || 
                       /^[a-zA-Z]:[\\/]/.test(urlStr) || // Windows路径如 C:\ 或 C:/
                       urlStr.startsWith('/') || // Unix路径
                       urlStr.startsWith('\\\\'); // 网络路径
    
    if (isLocalFile) {
      // 本地文件路径，验证通过
      // 可以添加额外的文件路径验证
    } else {
      // URL格式验证，接受http、https和magnet协议
      try {
        const url = new URL(urlStr);
        const protocol = url.protocol.toLowerCase();
        if (protocol !== 'http:' && protocol !== 'https:' && protocol !== 'magnet:') {
          errors.push('url必须是有效的HTTP、HTTPS或magnet URL');
        }
      } catch {
        errors.push('url必须是有效的URL格式或文件路径');
      }
    }
  }

  if (typeof episode.watched !== 'boolean') {
    errors.push('watched是必填字段且必须是布尔值');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// 辅助函数：验证Anime数组
export function validateAnimeList(animeList: any[]): ValidationResult {
  const errors: string[] = [];
  const animeIds = new Set<string>();

  for (const anime of animeList) {
    const result = validateAnime(anime);
    if (!result.isValid) {
      errors.push(`Anime "${anime.title || '未知'}" 验证失败: ${result.errors.join(', ')}`);
    }

    // 检查ID重复
    if (anime.id) {
      if (animeIds.has(anime.id)) {
        errors.push(`Anime ID "${anime.id}" 重复`);
      }
      animeIds.add(anime.id);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}