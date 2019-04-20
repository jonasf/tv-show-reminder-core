using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TvShowReminder.Contracts.Command;
using TvShowReminder.Contracts.Dto;
using TvShowReminder.Contracts.Query;
using TvShowReminder.Framework;

namespace tv_show_reminder_spa.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class EpisodeDataController : ControllerBase
    {
        private readonly ICommandSender _commandSender;
        private readonly IQuerySender _querySender;

        public EpisodeDataController(ICommandSender commandSender, IQuerySender querySender)
        {
            _commandSender = commandSender;
            _querySender = querySender;
        }

        [HttpGet("[action]")]
        public IEnumerable<UpcomingEpisode> UpcomingEpisodes()
        {
            var upcomingEpisodes = _querySender.Send(new EpisodesToDateQuery { ToDate = DateTime.Now.AddDays(1) });
            var result = new List<UpcomingEpisode>();

            foreach(var upcomingEpisode in upcomingEpisodes.Episodes)
            {
                result.Add(new UpcomingEpisode
                {
                    Id = upcomingEpisode.Episode.Id,
                    AirDate = upcomingEpisode.Episode.AirDate.ToString("yyyy-MM-dd"),
                    TvShowName = upcomingEpisode.Subscription.TvShowName,
                    Title = upcomingEpisode.Episode.Title,
                    SeasonNumber = upcomingEpisode.Episode.EpisodeNumber == 0 ? 
                                    string.Format("S{0} Special", upcomingEpisode.Episode.SeasonNumber) : 
                                    string.Format("S{0}E{1}", upcomingEpisode.Episode.SeasonNumber, upcomingEpisode.Episode.EpisodeNumber)
                });
            }

            return result;
        }

        [HttpPost("[action]")]
        public bool Delete(int[] episodeIds)
        {
            if (episodeIds != null)
            {
                var command = new DeleteEpisodesCommand { EpisodeIds = episodeIds };
                _commandSender.Send(command);
            }
            return true;
        }

        public class UpcomingEpisode
        {
            public int Id { get; set; }
            public string AirDate { get; set; }
            public string TvShowName { get; set; }
            public string Title { get; set; }
            public string SeasonNumber { get; set; }
        }
    }
}