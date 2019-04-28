using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using tv_show_reminder_spa.Controllers.Models;
using TvShowReminder.Contracts.Command;
using TvShowReminder.Contracts.Dto;
using TvShowReminder.Contracts.Query;
using TvShowReminder.Framework;

namespace tv_show_reminder_spa.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class SubscriptionDataController : ControllerBase
    {
        private readonly ICommandSender _commandSender;
        private readonly IQuerySender _querySender;

        public SubscriptionDataController(ICommandSender commandSender, IQuerySender querySender)
        {
            _commandSender = commandSender;
            _querySender = querySender;
        }

        [HttpGet("[action]")]
        public IEnumerable<TvShow> Search(string searchTerm)
        {
            var result = new List<TvShow>();

            if (HasSearchParameters(searchTerm))
            {
                var searchResult = _querySender.Send(new SearchTvShowQuery { Query = searchTerm });
                if(searchResult.TvShows != null && searchResult.TvShows.Any())
                {
                    result.AddRange(searchResult.TvShows);
                }
            }

            return result;
        }

        [HttpPost("[action]")]
        public bool Add([FromBody] AddSubscriptionParameter addSubscriptionParameter)
        {
            var command = new AddSubscriptionCommand
            {
                ShowId = addSubscriptionParameter.ShowId,
                ShowName = addSubscriptionParameter.showName
            };

            _commandSender.Send(command);

            return true;
        }

        [HttpPost("[action]")]
        public bool Delete([FromBody] int subscriptionId)
        {
            var command = new DeleteSubscriptionCommand
            {
                SubscriptionId = subscriptionId
            };

            _commandSender.Send(command);

            return true;
        }

        [HttpPost("[action]")]
        public bool RefreshEpisodesForSubscription([FromBody] int subscriptionId)
        {
            var command = new RefreshEpisodesCommand
            {
                SubscriptionId = subscriptionId
            };

            _commandSender.Send(command);

            return true;
        }

        [HttpPost("[action]")]
        public bool RefreshEpisodesForAllSubscriptions()
        {
            _commandSender.Send(new UpdateEpisodesForAllSubscriptionsCommand());
            return true;
        }

        [HttpGet("[action]")]
        public IEnumerable<SubscriptionWithNextEpisodeDto> List()
        {
            var showsWithNextEpisode = _querySender.Send(new AllSubscriptionsWithNextEpisodeQuery());
            return showsWithNextEpisode.Subscriptions.OrderBy(s => s.Subscription.TvShowName);
        }

        private bool HasSearchParameters(string query)
        {
            return !string.IsNullOrEmpty(query);
        }
    }
}
