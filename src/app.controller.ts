import { Body, Controller, Get, Post, Query, Render } from '@nestjs/common';
import { AppService } from './app.service.js';
import { CreateArticleViewDto } from './CreateArticleViewDto.js';

const data = [
  {
    "title": "Bulbasaur",
    "url": "https://en.wikipedia.org/wiki/Bulbasaur",
    "views": 65535
  },
  {
    "title": "Polandball",
    "url": "https://en.wikipedia.org/wiki/Polandball",
    "views": 1504
  },
  {
    "title": "Ludwig van Beethoven",
    "url": "https://en.wikipedia.org/wiki/Ludwig_van_Beethoven",
    "views": 889
  },
  {
    "title": "Arch Linux",
    "url": "https://en.wikipedia.org/wiki/Arch_Linux",
    "views": 2
  },
  {
    "title": "BMSZC Petrik Lajos Két Tanítási Nyelvű Technikum",
    "url": "https://hu.wikipedia.org/wiki/BMSZC_Petrik_Lajos_K%C3%A9t_Tan%C3%ADt%C3%A1si_Nyelv%C5%B1_Technikum",
    "views": 1480
  },
  {
    "title": "Pokémonok listája",
    "url": "https://hu.wikipedia.org/wiki/Pok%C3%A9monok_list%C3%A1ja",
    "views": 1024
  },
  {
    "title": "Pluto (törpebolygó)",
    "url": "https://hu.wikipedia.org/wiki/Pluto_(t%C3%B6rpebolyg%C3%B3)",
    "views": 59
  },
  {
    "title": "99 Luftballons",
    "url": "https://de.wikipedia.org/wiki/99_Luftballons",
    "views": 14876
  },
  {
    "title": "Pizza",
    "url": "https://it.wikipedia.org/wiki/Pizza",
    "views": 248
  },
  {
    "title": "フシギダネ",
    "url": "https://ja.wikipedia.org/wiki/%E3%83%95%E3%82%B7%E3%82%AE%E3%83%80%E3%83%8D",
    "views": 28937
  }
]


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getHello() {
    return {
      title: 'Szócikkek',
      articles: [...data].sort((first, second) =>
        first.title.localeCompare(second.title, 'hu'),
      ),
    }
  }

  @Get('filter')
  @Render('filter')
  filterArticles(@Query('minViews') minViews?: string) {
    const parsedMinViews = Number(minViews ?? 0);
    const threshold = Number.isFinite(parsedMinViews) ? parsedMinViews : 0;

    return {
      title: 'Szócikkek szűrése',
      minViews: threshold,
      articles: data
        .filter((article) => article.views >= threshold)
        .sort((first, second) => second.views - first.views),
    };
  }

  @Get('new')
  @Render('new')
  showNewArticleForm() {
    return {
      title: 'Új szócikk',
      success: false,
      error: undefined,
      article: new CreateArticleViewDto(),
    };
  }

  @Post('new')
  @Render('new')
  createArticle(@Body() form: CreateArticleViewDto) {
    const article = {
      title: typeof form?.title === 'string' ? form.title : '',
      url: typeof form?.url === 'string' ? form.url : '',
      views:
        typeof form?.views === 'string' || typeof form?.views === 'number'
          ? String(form.views)
          : '',
    };
    const views =
      article.views.trim() === '' ? Number.NaN : Number(article.views);
    let error: string | undefined;

    if (!article.title.trim() || !article.url.trim() || !article.views.trim()) {
      error = 'Minden mező kitöltése kötelező.';
    } else if (!article.url.startsWith('https://')) {
      error = 'Az URL-nek https:// kezdetűnek kell lennie.';
    } else if (!Number.isFinite(views) || views < 0) {
      error = 'A megtekintések száma legalább 0 legyen.';
    }

    if (error) {
      return {
        title: 'Új szócikk',
        success: false,
        error,
        article,
      };
    }

    data.push({ ...article, views });

    return {
      title: 'Új szócikk',
      success: true,
      article: new CreateArticleViewDto(),
    };
  }
}
