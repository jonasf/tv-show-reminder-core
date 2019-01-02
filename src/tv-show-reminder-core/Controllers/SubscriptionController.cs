﻿using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TvShowReminder.Contracts.Command;
using TvShowReminder.Contracts.Query;
using TvShowReminder.Framework;
using TvShowReminder.Models;

namespace tv_show_reminder_core.Controllers
{
    [Authorize]
    public class SubscriptionController : Controller
    {
        private readonly ICommandSender _commandSender;
        private readonly IQuerySender _querySender;

        public SubscriptionController(ICommandSender commandSender,
                                        IQuerySender querySender)
        {
            _commandSender = commandSender;
            _querySender = querySender;
        }

        public ActionResult Search(string q)
        {
            var searchViewModel = new SearchViewModel();

            if (HasSearchParameters(q))
            {
                var result = _querySender.Send(new SearchTvShowQuery { Query = q });
                searchViewModel.SearchWords = q;
                searchViewModel.HasSearch = true;
                searchViewModel.TvShows = result.TvShows;
                searchViewModel.SearchHits = result.TvShows.Count();
            }

            return View(searchViewModel);
        }

        public ActionResult Add(int showId, string showName)
        {
            var command = new AddSubscriptionCommand
            {
                ShowId = showId,
                ShowName = showName
            };

            _commandSender.Send(command);

            return View();
        }

        [HttpPost]
        public ActionResult Delete(int subscriptionId)
        {
            var command = new DeleteSubscriptionCommand
            {
                SubscriptionId = subscriptionId
            };

            _commandSender.Send(command);

            return View();
        }

        [HttpPost]
        public ActionResult RefreshEpisodesForSubscription(int subscriptionId)
        {
            var command = new RefreshEpisodesCommand
            {
                SubscriptionId = subscriptionId
            };

            _commandSender.Send(command);

            return RedirectToAction("List", "Subscription");
        }

        public ActionResult List()
        {
            var result = _querySender.Send(new AllSubscriptionsWithNextEpisodeQuery());
            var viewModel = new SubscriptionsListViewModel
            {
                Subscriptions = result.Subscriptions.OrderBy(s => s.Subscription.TvShowName)
            };

            return View(viewModel);
        }

        private bool HasSearchParameters(string query)
        {
            return !string.IsNullOrEmpty(query);
        }
    }
}