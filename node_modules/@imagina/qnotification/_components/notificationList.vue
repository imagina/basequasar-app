<template>
	<div id="notificationList" class="full-height" view="hHh Lpr lFf">
		<q-layout container style="height: 100%;">
			<q-layout-header class="no-shadow text-center q-py-md bg-white">
				<h1 class="q-title text-primary q-ma-none">
					<q-icon name="fas fa-bell"></q-icon>
					Notifications
				</h1>
				<q-toggle v-model="filter.unread"
				          class="q-mt-md"
				          label="Only Unread"/>
			</q-layout-header>

			<q-page-container>
				<q-tabs v-model="tabsModel" animated align="justify">

					<!--= Tab list notifications =-->
					<q-tab-pane name="list-notifications">
						<!--Notifications-->
						<q-list link no-border separator class="full-width"
								v-if="this.$store.state.notification.notifications.length >= 1">
							<q-item multiline :key="key" :class="!notification.viewedDate ? 'unread' : ''"
							        @click.native="showNotification(notification)"
							        v-if="!notification.viewedDate || (notification.viewedDate && !filter.unread)"
							        v-for="(notification,key) in this.$store.state.notification.notifications.slice(0, 20)">
								<!--img user-->
								<q-item-side>
									<q-item-tile avatar>
										<img :src="getmainimage(notification.user)" :alt="notification.user.fullName"
										     width="32px" style="border-radius: 100%">
									</q-item-tile>
								</q-item-side>
								<!--Content Notification-->
								<q-item-main
									:label="notification.user.fullName"
									label-lines="1"
									:sublabel="notification.options.summary ? notification.options.summary : notification.message"
									sublabel-lines="1"
								/>
								<!-- Date notification -->
								<q-item-side right>
									<q-item-tile stamp>
										{{$d($moment(notification.date, 'YYYY-MM-DD HH:mm').toDate(), 'short', $q.i18n.lang)}}
										<div class="q-mt-sm">
											<q-icon name="fas fa-exclamation-circle" color="primary" v-if="!notification.viewedDate"></q-icon>
											{{$d($moment(notification.date, 'YYYY-MM-DD HH:mm').toDate(), 'time', $q.i18n.lang)}}
										</div>
									</q-item-tile>
								</q-item-side>
							</q-item>
						</q-list>
						<!--Empty notifications Box-->
						<div v-else class="text-center text-grey-6 q-mt-md q-px-md">
							<div class="q-box bg-white q-py-sm">
								There are no notifications...
							</div>
						</div>
					</q-tab-pane>

					<!--= Tab show notification =-->
					<q-tab-pane name="show-notification">
						<!--Button to return list notifications-->
						<q-btn icon="fas fa-arrow-left" label="Notifications"
						       flat color="secondary" @click="tabsModel = 'list-notifications'">
						</q-btn>
						<!--Notification-->
						<div v-if="notification" class="showNotification q-mt-md">
							<!--User notification-->
							<q-chip :avatar="getmainimage(notification.user)"
							        color="teal" text-color="white" small>
								{{notification.user.fullName}}
							</q-chip>

							<!--Message-->
							<div class="bg-white full-width q-pa-sm q-body-1 q-mt-md q-mb-lg">
								<!--Message-->
								<p>{{notification.message}}</p>
								<!--Created At-->
								<div class="q-caption text-grey-7">
                  <span>
                    {{$d($moment(notification.date, 'YYYY-MM-DD HH:mm').toDate(), 'short', $q.i18n.lang)}}
                  </span>
									<span class="float-right">
                    {{$d($moment(notification.date, 'YYYY-MM-DD HH:mm').toDate(), 'time', $q.i18n.lang)}}
                  </span>
								</div>
							</div>

							<!--Button URL-->
							<div class="text-center">
								<q-btn v-if="notification.options.url" label="Go"
								       @click="goToNotificationURL(notification.options.url)"
								       color="secondary" icon="fas fa-globe">
								</q-btn>
							</div>
						</div>
					</q-tab-pane>
				</q-tabs>
			</q-page-container>

			<q-layout-footer id="footer" class="no-shadow bg-white">
				<q-btn flat color="primary"
				       :to="{name : 'index'}">
					show all
				</q-btn>
				<q-btn flat class="float-right"
				       :to="{name : 'notifications.create'}"
				       color="primary" v-if="hasAccess">
					<q-icon class="q-mr-sm" name="fas fa-location-arrow"></q-icon>
					Send
				</q-btn>
			</q-layout-footer>
		</q-layout>
	</div>
</template>
<script>
	import {helper} from '@imagina/qsite/_plugins/helper';
	import auth from '@imagina/quser/_plugins/auth' //Middleware auth

	export default {
		props: {},
		components: {},
		watch: {},
		mounted() {
			this.$nextTick(function () {
				this.hasAccess = auth.hasAccess('inotification.notifications.create')
			})
		},
		data() {
			return {
				filter: {
					unread: false
				},
				tabsModel: 'list-notifications',
				notification: false,
				hasAccess: false,
			}
		},

		methods: {
			//Return path mainimage
			getmainimage(user){
				return config('apirRoutes.api.base_url') + '/' + user.mainImage
			},
			//Show notification
			showNotification(data) {
				this.notification = data
				this.tabsModel = 'show-notification'
				this.updateNotification(data)
			},
			//Redirec to URL from notification
			goToNotificationURL(url) {
				/*if (url)
					if (!url.match(/^https?:\/\//i)) {
						url = 'http://' + url;
					}*/
				document.location.href = url;
			},
			//Update viewed at from notification
			updateNotification(notification) {
				if (!notification.viewedDate) {
					this.$store.dispatch('notification/UPDATE_NOTIFICATION', {id: notification.id})
				}
			}
		}
	}
</script>
<style lang="stylus">
	#notificationList
		.q-tabs
			.q-tabs-head
				display none

			.q-tabs-panes
				.q-tab-pane
					padding 0

				.showNotification
					padding 8px 16px

		.q-list
			padding 0
			.unread
				border-left 2px solid $primary !important
				background white !important
				.q-item-avatar
					border 2px solid $primary !important

</style>
