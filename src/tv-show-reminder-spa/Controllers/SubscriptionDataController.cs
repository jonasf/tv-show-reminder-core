using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TvShowReminder.Contracts.Command;
using TvShowReminder.Contracts.Dto;
using TvShowReminder.Contracts.Query;
using TvShowReminder.Framework;

namespace tv_show_reminder_spa.Controllers
{
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

        private bool HasSearchParameters(string query)
        {
            return !string.IsNullOrEmpty(query);
        }

        public class AddSubscriptionParameter
        {
            public int ShowId { get; set; }
            public string showName { get; set; }
        }
    }
}
